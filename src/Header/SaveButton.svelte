<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { showSaveDashboardDialog } from '@/SaveDashboardDialog.svelte'
  import { getAppContext } from '@/context'
  import { startDeleteDashboardFlow, startSaveFlow } from '@/flow/dashboard'

  let className = ''
  export { className as class }
  // export let user
  export let isAuthor

  const { dashboard$ } = getAppContext()

  let isOpened = false
  $: dashboard = $dashboard$

  enum SaveType {
    Save,
    SaveAsNew,
    Edit,
  }

  function onClick(type: SaveType) {
    const promise =
      type === SaveType.Save
        ? startSaveFlow(dashboard)
        : showSaveDashboardDialog({
            title: 'Save dashboard',
            action: 'Save',
            dashboard: type === SaveType.SaveAsNew ? { ...dashboard, id: undefined } : dashboard,
          })

    promise.then((dashboard) => {
      if (dashboard) dashboard$.set(dashboard as SAN.Queries.Dashboard)
    })
  }

  function onDelete() {
    startDeleteDashboardFlow(dashboard)
    // @ts-ignore
    delete dashboard.id
    delete dashboard.user

    isOpened = false
    dashboard$.set(dashboard)
  }
</script>

<div class="row mrg-a mrg--l border relative">
  <button class="save btn" on:click={() => onClick(isAuthor ? SaveType.Save : SaveType.SaveAsNew)}
    >{isAuthor ? 'Save' : 'Save as'}</button>
  <Tooltip on="click" duration={0} align="center" class="$style.tooltip" bind:isOpened>
    <button slot="trigger" class="more btn row hv-center">
      <Svg id="arrow-down" w="8" h="5" />
    </button>
    <div slot="tooltip">
      <button
        class="btn-ghost"
        on:click={() => onClick(isAuthor ? SaveType.Save : SaveType.SaveAsNew)}>Save</button>

      {#if dashboard.id}
        <button class="btn-ghost" on:click={() => onClick(SaveType.SaveAsNew)}>Save as new</button>
      {/if}

      {#if isAuthor}
        <button class="btn-ghost" on:click={() => onClick(SaveType.Edit)}>Edit</button>

        <div class="divider" />

        <button class="delete btn-ghost" on:click={onDelete}>Delete</button>
      {/if}
    </div>
  </Tooltip>
</div>

<!-- <a href="/" class="bnt-0 mrg-l mrg--l">Documentation</a> -->

<button
  class="btn mrg-xl mrg--l row v-center {className}"
  on:click={() => onClick(SaveType.SaveAsNew)}>
  <Svg id="copy" w="16" class="mrg-s mrg--r" />
  Duplicate
</button>

<style>
  .save {
    padding: 6px 14px;
    border-right: 1px solid var(--porcelain);
    border-radius: 0;
  }

  .more {
    width: 32px;
    --color: var(--waterloo);
  }

  .save,
  .more {
    --color-hover: var(--green);
  }
  .tooltip {
    left: 0px !important;
    width: 200px;
    padding: 8px;
  }

  .btn-ghost {
    width: 100%;
  }
  .divider {
    margin: 8px -8px;
    border-bottom: 1px solid var(--porcelain);
  }

  .delete {
    --color: var(--red);
    --color-hover: var(--red-hover);
  }
</style>
