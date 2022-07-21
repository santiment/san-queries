<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { showSaveDashboardDialog } from '@/SaveDashboardDialog.svelte'
  import { getAppContext } from '@/context'
  import { startSaveFlow } from '@/flow/dashboard'

  let className = ''
  export { className as class }
  export let user
  export let isAuthor

  const { dashboard$ } = getAppContext()

  function onClick() {
    const dashboard = $dashboard$

    const promise = isAuthor
      ? startSaveFlow(dashboard)
      : showSaveDashboardDialog({ title: 'Save dashboard', action: 'Save', dashboard })

    promise.then((dashboard) => {
      if (dashboard) dashboard$.set(dashboard as SAN.Queries.Dashboard)
    })
  }
</script>

<button class="btn mrg-a mrg--l row v-center {className}" on:click={onClick}>
  <Svg id={user && !isAuthor ? 'copy' : 'save'} w="16" class="mrg-s mrg--r" />

  {#if !user}
    Save as
  {:else if isAuthor}
    Save
  {:else}
    Duplicate
  {/if}
</button>
