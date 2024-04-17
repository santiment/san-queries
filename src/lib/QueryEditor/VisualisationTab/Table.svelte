<script lang="ts">
  import type { Snippet } from 'svelte'
  import { ssd } from 'svelte-runes'
  import * as Field from '$lib/ui/Field'
  import Visualisation from '$lib/Visualization/Table'
  import { useTableColumnsCtx } from '$lib/Visualization/Table/ctx.svelte'
  import { useQuerySettingsCtx } from '../ctx'

  let {
    query,
    sqlData,
    columnSettings,
    children,
  }: {
    sqlData: App.SqlData
    columnSettings: SS<App.ColumnSettings>
    children: Snippet<
      [
        {
          visualisation: typeof visualisation
          visualisationControls: typeof visualisationControls
          columnControls: typeof columnControls
        },
      ]
    >
  } = $props()

  const DIRECTIONS = [
    { name: 'Descending', value: 'desc' },
    { name: 'Ascending', value: 'asc' },
  ] as const
  const DirToOption = { desc: DIRECTIONS[0], asc: DIRECTIONS[1] }

  const querySettingsCtx = useQuerySettingsCtx()
  const { dataColumns } = useTableColumnsCtx(sqlData, columnSettings)

  let sortableColumns = $derived(dataColumns.$.filter((column) => !!column.sortAccessor))
  const sorted = {
    column: ssd(() => {
      const { sort } = querySettingsCtx.settings.$
      return sort?.column ? sortableColumns.find((item) => item.key === sort.column) : undefined
    }),
    direction: ssd(() => querySettingsCtx.settings.$.sort?.dir),
  }

  function applySort(column?: (typeof sortableColumns)[number], dir: 'asc' | 'desc' = 'desc') {
    querySettingsCtx.settings.$.sort = column ? { column: column.key, dir } : undefined
    sorted.column.$ = column
    sorted.direction.$ = dir
  }

  function onSortedColumnChange(_column: null | (typeof sortableColumns)[number]) {
    const column = _column ? sortableColumns.find((item) => item.key === _column.key) : undefined

    applySort(column, sorted.direction.$)
  }

  function onSortDirectionChange(dir: null | (typeof DIRECTIONS)[number]) {
    if (sorted.column.$) applySort(sorted.column.$, dir?.value)
  }

  function onSortClick(column: (typeof dataColumns)['$'][number], dir: 'asc' | 'desc') {
    applySort(column, dir)
  }
</script>

{#snippet visualisation()}
  <Visualisation
    class="rounded border"
    {sqlData}
    settings={columnSettings}
    sortController={sorted}
    {onSortClick}
  ></Visualisation>
{/snippet}

{#snippet visualisationControls()}
  <Field.Select
    name="Sorted column"
    options={sortableColumns}
    value={sorted.column.$}
    defaultValue="Default"
    onChange={onSortedColumnChange}
  >
    {#snippet children({ option })}
      {option.title}
    {/snippet}
  </Field.Select>

  <Field.Select
    name="Sort direction"
    options={DIRECTIONS}
    value={sorted.direction.$ && DirToOption[sorted.direction.$]}
    defaultValue="No sorting"
    onChange={onSortDirectionChange}
  >
    {#snippet children({ option })}
      {option.name}
    {/snippet}
  </Field.Select>
{/snippet}

{#snippet columnControls()}{/snippet}

{@render children({ visualisation, visualisationControls, columnControls })}
