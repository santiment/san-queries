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

  export let dashboard
  export let onSubmit
  export let title = 'New dashboard'
  export let action = 'Create'
  export let dashboardMutation, panelMutation

  let closeDialog
  let { id, name, description = '', isPublic, panels, sql } = dashboard

  function onFormSubmit() {
    if (!name) return

    dashboardMutation({ id, name, description, isPublic }).then((data) => {
      console.log(data, dashboard)

      Object.assign(dashboard, data)
      // dashboard.panels = panels

      return Promise.all(
        panels.map((panel) =>
          panelMutation({
            dashboardId: id,
            name: panel.name,
            type: panel.type,
            sql,
          }),
        ),
      ).then((panels) => dashboard.panels.push(...panels))
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
      <button class="btn-1 btn--l mrg-a mrg--r" type="submit">
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
