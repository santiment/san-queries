<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import { getDialogCtx } from 'san-webkit/lib/ui/Dialog'
  import { startSaveAlertFlow } from './flow'

  export let category: App.Alerts.Category
  export let alertId: null | number
  export let disabled: boolean
  export let source: string

  let loading = false

  const DialogCtx = getDialogCtx()

  $: alert = category.alert

  function onClick() {
    DialogCtx.lock()

    loading = true
    alert.id = alertId

    startSaveAlertFlow(category, alert)
      .then(() => {
        track.event('create_alert_submit', {
          category: 'Interaction',
          source_url: window.location.href,
          source,
        })
        DialogCtx.close()
      })
      .finally(() => {
        DialogCtx.unlock()
        loading = false
      })
  }
</script>

<div>
  <button class="btn-1" class:disabled={!alert.valid || disabled} on:click={onClick} class:loading>
    {alertId ? 'Update' : 'Create'} alert
  </button>
</div>

<style>
  div {
    position: fixed;
    padding: 32px 0 24px 47px;
    bottom: 0;
    left: 0;
    width: 373px;
    background: linear-gradient(0deg, var(--white) 70%, transparent);
  }
</style>
