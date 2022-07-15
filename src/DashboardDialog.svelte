<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import DashboardDialog from './DashboardDialog.svelte'

  export const showDashboardDialog = (props): Promise<unknown> =>
    dialogs.showOnce(DashboardDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Field from 'webkit/ui/Field/svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'

  export let dashboard
  export let onSubmit

  let closeDialog
  let { name, description = '', isPublic } = dashboard || {}

  function onFormSubmit() {
    if (!name) return
  }
</script>

<Dialog
  bind:closeDialog
  {...$$props}
  title={dashboard ? 'Edit dashboard' : 'New dashboard'}
  class="$style.dialog">
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
        value={description}
        placeholder="Description of the dashboard" />
    </Field>

    <div class="row v-center mrg-xl mrg--t">
      <button class="btn-1 btn--l mrg-a mrg--r" type="submit">
        {dashboard ? 'Save' : 'Create'}
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
