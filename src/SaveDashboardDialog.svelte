<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import SaveDashboardDialog from './SaveDashboardDialog.svelte'

  export const showSaveDashboardDialog = (props): Promise<unknown> =>
    dialogs.showOnce(SaveDashboardDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Field from 'webkit/ui/Field/svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import { startSaveFlow } from './flow/dashboard'

  export let dashboard
  export let title = 'New dashboard'
  export let action = 'Create'

  export let DialogPromise: SAN.DialogController
  let closeDialog
  let { title: name, description = '', isPublic } = dashboard
  let loading = false

  function onFormSubmit() {
    if (!name) return

    loading = true

    startSaveFlow(dashboard)
      .then(() => {
        DialogPromise.resolve(dashboard)
        closeDialog()
      })
      .finally(() => {
        loading = false
      })
  }
</script>

<Dialog bind:closeDialog {...$$props} {title} class="$style.dialog">
  <form class="dialog-body" on:submit|preventDefault={onFormSubmit}>
    <Field
      bind:value={name}
      autofocus
      required
      title="Name"
      placeholder="Name of the dashboard"
      autocomplete="off" />

    <Field title="Description">
      <textarea
        class="input border fluid"
        name="description"
        rows="4"
        bind:value={description}
        placeholder="Description of the dashboard" />
    </Field>

    <div class="row v-center mrg-xl mrg--t">
      <button class="btn-1 btn--l mrg-a mrg--r" class:loading type="submit">
        {action}
      </button>

      Public
      <Toggle class="mrg-m mrg--l" isActive={isPublic} on:click={() => (isPublic = !isPublic)} />
    </div>
  </form>
</Dialog>

<style>
  .dialog {
    width: 480px;
  }

  .btn-1 {
    --h-padding: 30px;
  }
</style>
