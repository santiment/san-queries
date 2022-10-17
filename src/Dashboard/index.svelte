<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { PanelType } from '@/types'
  import { newPanel } from '@/stores/dashboard'
  import Panel from './Panel.svelte'
  import { mutateComputeRawClickhouseQuery } from '@/api/rawQuery'
  import { getParametersMap } from '@/utils/parameters'
  import { Formatter, FormatType } from '@/PanelEditor/Result/Options/format'
  import { notifications$ } from 'san-webkit/lib/ui/Notifications'

  export let dashboard
  export let selectedPanel

  let isOpened = false

  $: ({ panels } = dashboard)
  $: isSinglePanel = panels.length === 1

  function onSelect(type) {
    const panel = newPanel(`My panel (${type.toLowerCase()})`, type)
    panel.__scrollOnMount = true

    panels.push(panel)
    panels = panels
    isOpened = false
  }

  function onPanelDelete(panel) {
    panels = panels.filter((v) => v !== panel)
  }

  function onGetDataClick() {
    panels.forEach((panel) => {
      const { query, parameters } = panel.sql

      return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters))
        .then((data) => {
          const { rows, headers, dateColumns } = data

          panel.__rows = rows
          panel.__computedSql = data
          panel.settings.columns = headers.map((title, i) => newColumn(title, i, dateColumns))

          panels = panels
        })
        .catch(() => {
          notifications$.show({
            title: 'Error during data load',
            type: 'error',
          })
        })
    })
  }

  // TODO: refactor. Move to utils. Same for PanelEditor/Result/index.svelte
  function newColumn(title, i, dateColumns) {
    const accessor = (data) => data[i]

    const column = {
      id: i,
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (dateColumns.has(i)) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatter = fn
      column.formatterId = id
      column.sortAccessor = (data) => Date.parse(data[i])
    }

    return column
  }
</script>

<div class="row mrg-l mrg--b justify">
  <button class="btn-1" on:click={onGetDataClick}>Get data</button>

  <div class="relative mrg-a mrg--l">
    <Tooltip on="click" position="bottom" class="$style.tooltip" bind:isOpened>
      <button slot="trigger" class="new btn-2">
        New panel
        <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
      </button>

      <div slot="tooltip" class="column">
        <button class="btn-ghost" on:click={() => onSelect(PanelType.TABLE)}>Table</button>
        <button class="btn-ghost" on:click={() => onSelect(PanelType.CHART)}>Chart</button>
      </div>
    </Tooltip>
  </div>
</div>

<section>
  {#each panels as panel}
    <Panel
      {panel}
      on:click={() => (selectedPanel = panel)}
      onDelete={isSinglePanel ? null : () => onPanelDelete(panel)} />
  {/each}
</section>

<style>
  section {
    gap: 24px;
    display: grid;
  }

  .new {
    background: var(--white);
  }

  .tooltip {
    padding: 8px;
    width: 100%;
  }
</style>
