<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showAddToDashboardDialog = (props: any) =>
    dialogs.__show(Component, { ...props, strict: true })
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Dashboards from './Dashboard.svelte'
  import { queryGetUserDashboards } from '$lib/api/dashboard/get'
  import Svg from 'webkit/ui/Svg/svelte'

  export let queryEditor: App.QueryEditorStoreValue
  export let currentUser: App.CurrentUser
  export let DialogCtx: SAN.Dialog.Ctx
  export let onQueryAdd: any

  const query = queryEditor.query as App.ApiQuery

  const { sql } = queryEditor
  let { name, description } = queryEditor
  let { isPublic } = query || {}

  let dashboards = [] as any[]

  queryGetUserDashboards().then((data) => (dashboards = data))
  $: console.log(dashboards)

  function onUpdateClick() {
    DialogCtx.resolve({ name, description, isPublic })
    DialogCtx.close()
  }

  function onAdd(dashboard) {
    onQueryAdd(dashboard)
  }

  track.event('add_to_dashboard_dialog_open', {
    category: 'General',

    source_url: window.location.href,
  })

  onDestroy(() => {
    if (BROWSER) {
      track.event('add_to_dashboard_dialog_close', {
        category: 'General',

        source_url: window.location.href,
      })
    }
  })
</script>

<Dialog {...$$props} title="Add this query to a dashboard">
  <div class="dialog-body column gap-l">
    <Dashboards {dashboards} user={currentUser} {onAdd} />
  </div>
  <actions class="row">
    <button class="btn-2 row hv-center gap-s">
      <Svg id="plus-circle-filled" w="16" />
      New dashboard</button
    >
  </actions>
</Dialog>

<style lang="scss">
  Dialog {
    width: 960px;
  }

  .dialog-body {
    padding: 24px 32px;
  }

  actions {
    padding: 0px 32px 32px;
    fill: var(--green);
  }
</style>
