<script lang="ts">
  import { ssd } from 'svelte-runes'
  import * as Field from '$lib/ui/Field'
  import Controls from './Controls.svelte'
  import Table from './Table.svelte'
  import Chart from './Chart.svelte'
  import * as Control from './Control'
  import { useQueryEditorCtx, useQuerySettingsCtx } from '../ctx'

  let {
    sqlData,
    readonly = true,
    isWithControls = true,
  }: { sqlData: App.SqlData; readonly: boolean; isWithControls?: boolean } = $props()

  const { queryEditor } = useQueryEditorCtx()
  const { settings, setVisualisation } = useQuerySettingsCtx()

  const VisualisationComponent = { Table, Chart } // as Record<string, Table | Chart>
  const VisualisationOptions = Object.keys(
    VisualisationComponent,
  ) as (keyof typeof VisualisationComponent)[]

  let queryVisualisation = $derived(settings.$.visualisation)
  const columnSettings = ssd(() => settings.$.columns)

  function onVisualizationChange(option: keyof typeof VisualisationComponent) {
    setVisualisation(option)
  }
</script>

<svelte:component this={VisualisationComponent[queryVisualisation]} {sqlData} {columnSettings}>
  {#snippet children({ visualisation, visualisationControls, columnControls, openedColumns })}
    <section class="flex min-h-0 min-w-0 flex-1 flex-col">
      {@render visualisation()}
    </section>

    {#if isWithControls}
      <section class="flex min-w-[320px] max-w-[320px] flex-col gap-4 overflow-auto">
        <Controls title="Visualization: {queryVisualisation}">
          <Field.Select
            name="Visualization type"
            value={queryVisualisation}
            options={VisualisationOptions}
            onChange={onVisualizationChange}
          ></Field.Select>

          {@render visualisationControls()}
        </Controls>

        {#each sqlData.columns as column, i (column)}
          {@const columnSettings = settings.$.columns[column]}
          <Controls title="Column {i}: {column}" isOpenedDefault={openedColumns?.has(column)}>
            <Control.Title {column} value={columnSettings?.title}></Control.Title>

            <Control.Formatting
              {column}
              type={sqlData.columnTypes[i]}
              value={columnSettings?.formatter}
            ></Control.Formatting>

            {@render columnControls({ column, columnSettings })}
          </Controls>
        {/each}
      </section>
    {/if}
  {/snippet}
</svelte:component>
