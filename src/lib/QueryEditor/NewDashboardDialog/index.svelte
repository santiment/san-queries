<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showNewDashboardDialog = (props: any) =>
    dialogs.__show(Component, { ...props, strict: true })
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Control from '$lib/QueryEditor/Visualisation/Control.svelte'

  export let DialogCtx: SAN.Dialog.Ctx

  let name = ''
  let description = ''

  function onUpdateClick() {
    DialogCtx.resolve({ name, description })
    DialogCtx.close()
  }

  track.event('new_dashboard_dialog_open', {
    category: 'General',

    source_url: window.location.href,
  })

  onDestroy(() => {
    if (BROWSER) {
      track.event('new_dashboard_dialog_close', {
        category: 'General',

        source_url: window.location.href,
      })
    }
  })
</script>

<Dialog {...$$props} title="New dashboard">
  <div class="dialog-body column gap-l">
    <Control
      name="Name"
      value={name}
      placeholder="Name of the dashboard"
      onUpdate={(value) => (name = value)}
    />

    <Control
      textarea
      name="Description"
      value={description}
      onUpdate={(value) => (description = value)}
    />

    <actions class="row gap-l mrg-l mrg--t">
      <button class="btn-1" on:click={onUpdateClick} class:disabled={false}> Create </button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 480px;
  }
</style>
