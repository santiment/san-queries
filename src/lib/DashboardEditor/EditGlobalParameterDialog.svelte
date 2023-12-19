<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './EditGlobalParameterDialog.svelte'

  export const showEditGlobalParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  // import { getQueryEditor$Ctx } from '$routes/query/new/ctx'

  import Control from '$lib/QueryEditor/Visualisation/Control.svelte'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import GlobalQuery from './GlobalQuery.svelte'

  export let parameter = { key: '', value: '' as string | number, type: 'Text', overrides: {} }
  export let DialogCtx: SAN.Dialog.Ctx

  const { key } = parameter
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: dashboardEditor = $dashboardEditor$
  $: queries = dashboardEditor.widgets.filter(checkIsQueryWithParameters)

  $: console.log(queries)

  function checkIsQueryWithParameters(widget: (typeof dashboardEditor)['widgets']) {
    if (widget.type !== 'QUERY') return

    return Object.keys(widget.query.sqlQueryParameters).length > 0
  }

  function onAddClick() {
    if (parameter.type === 'Number') {
      parameter.value = +parameter.value
    }

    DialogCtx.resolve(parameter)
    DialogCtx.close()
  }
</script>

<Dialog {...$$props} title="{key ? 'Edit' : 'Add'} global parameter">
  <div class="dialog-body column gap-l">
    <Control
      name="Name"
      value={parameter.key}
      placeholder="Name of the parameter"
      onUpdate={(value) => (parameter.key = value)}
    />

    <Control
      name="Type"
      options={['Text', 'Number']}
      value={parameter.type}
      onUpdate={(value) => (parameter.type = value)}
    />

    <Control
      name="Value"
      value={parameter.value}
      placeholder="Default value of the parameter"
      onUpdate={(value) => (parameter.value = value)}
    />

    <!-- <SQLEditor value={$queryEditor$.sql} onValueChange={onEditorValueChange} /> -->

    {#if queries.length}
      <queries class="column gap-l">
        <h3 class="body-1 txt-m">Link local parameters from queries added to this dashboard</h3>

        {#each queries as widget}
          <GlobalQuery {widget} overrides={parameter.overrides} />
        {/each}
      </queries>
    {/if}

    <actions class="row gap-l mrg-l mrg--t">
      <button
        class="btn-1"
        on:click={onAddClick}
        class:disabled={!parameter.key || !parameter.value}
      >
        {key ? 'Edit' : 'Add'}
      </button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 600px;
  }
</style>
