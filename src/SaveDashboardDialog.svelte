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
  import { getParametersMap } from './utils/parameters'

  export let dashboard
  export let title = 'New dashboard'
  export let action = 'Create'
  export let dashboardMutation, panelMutation
  export let newPanelMutation = panelMutation

  export let DialogPromise: SAN.DialogController
  let closeDialog
  let { id, title: name, description = '', isPublic, panels, settings } = dashboard
  let loading = false

  function onFormSubmit() {
    if (!name) return

    loading = true

    dashboardMutation({
      id,
      title: name,
      description,
      isPublic,
      settings: JSON.stringify(settings),
    }).then((data) => {
      console.log(data, dashboard, panels)

      Object.assign(dashboard, data)
      dashboard.panels = panels

      return Promise.all(
        panels.map((panel) =>
          (panel.id ? panelMutation : newPanelMutation)({
            dashboardId: dashboard.id,
            panelId: panel.id,
            name: panel.name,
            sql: {
              query: settings.sql,
              parameters: JSON.stringify(getParametersMap(settings.parameters)),
            },
            settings: JSON.stringify({
              type: panel.type,
              xAxisKey: panel.xAxisKey,
            }),
          }),
        ),
      ).then((panels) => {
        console.log(panels)
        DialogPromise.resolve(dashboard)
        loading = false
        closeDialog()
      })
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
