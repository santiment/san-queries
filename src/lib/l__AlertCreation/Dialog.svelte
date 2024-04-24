<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import AlertCreationDialog from './Dialog.svelte'

  export const showAlertCreationDialog = (alert?: App.Alerts.ApiAlert, source?: string) =>
    dialogs.showOnce(AlertCreationDialog, { alert, source })
</script>

<script lang="ts">
  import type { SelectedCategory } from './categories'

  import { onDestroy, onMount } from 'svelte'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { getCustomer$Ctx } from 'san-webkit/lib/stores/customer'
  import { track } from 'san-webkit/lib/analytics'
  import { getAlertsRestrictions } from './utils'
  import { queryUserAlerts } from './api'
  import CategoriesScreen from './CategoriesScreen.svelte'
  import CategorySceenLayout from './CategorySceenLayout.svelte'
  import RestrictionMessage from './RestrictionMessage.svelte'
  import { CATEGORIES, normalizeCategory } from './categories'
  import { BROWSER } from 'esm-env'

  export let alert: null | App.Alerts.ApiAlert = null
  export let source = ''

  const { customer$ } = getCustomer$Ctx()

  let loading = false
  let category = alert ? assignCategory(alert) : null
  let hasRestriction = true

  if (BROWSER) checkUserRestriction()

  function checkUserRestriction() {
    queryUserAlerts().then(({ currentUser }) => {
      const alerts = currentUser?.alerts || []
      const { isPro, isProPlus } = $customer$
      const { maxAmount, currentAmount } = getAlertsRestrictions(alerts, isPro, isProPlus)

      hasRestriction = currentAmount >= maxAmount
    })
  }

  function assignCategory(apiAlert: App.Alerts.ApiAlert): SelectedCategory {
    const alertCategory = CATEGORIES.find(({ matchApiAlert }) => matchApiAlert(apiAlert))

    if (!alertCategory) {
      return (alert = null)
    }

    const category = normalizeCategory(alertCategory)
    loading = true

    Promise.all(
      category.steps.map((step) => {
        const promise = step.getData ? (step.getData as any)(apiAlert) : Promise.resolve(undefined)

        return promise
          .then((data: any) => {
            step.value = step.parseApiAlert(apiAlert, data)
            step.validate()
          })
          .catch(console.log)
      }),
    ).finally(() => {
      loading = false
    })

    return category as SelectedCategory
  }

  onMount(() => {
    track.event('create_alert_dialog_open', {
      category: 'Interaction',
      source_url: window.location.href,
      source,
    })
  })

  onDestroy(() => {
    track.event('create_alert_dialog_close', {
      category: 'Interaction',
      source_url: window.location.href,
      source,
    })
  })
</script>

<Dialog
  {...$$props}
  title="Create custom alerts"
  class="alert-dialog h-full !max-h-[640px] w-full !max-w-[960px]"
>
  {#if loading}
    <div class="loading" />
  {:else if category}
    {#if hasRestriction}
      <RestrictionMessage />
    {/if}
    <CategorySceenLayout
      bind:category
      {source}
      alertId={alert ? alert.id : null}
      hasCategorySelector={!alert}
    />
  {:else}
    {#if hasRestriction}
      <RestrictionMessage />
    {/if}
    <CategoriesScreen bind:category />
  {/if}
</Dialog>

<style>
  :global(.alert-dialog .disabled) {
    --color: var(--mystic);
    --bg: var(--athens) !important;
    pointer-events: none;
  }

  :global(.alert-dialog .input) {
    padding: 5px 8px;
    color: var(--black);
    border: 1px solid var(--border, var(--porcelain));
  }

  .loading {
    height: 100%;
  }
</style>
