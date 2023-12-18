<script lang="ts" context="module">
  export function getChartColumns(sqlData: App.SqlData, ColumnSettings: Record<string, any>) {
    const metrics = [] as any[]
    const dateColumns = [] as any[]

    let dateColumn: string

    sqlData.headers.forEach((key, i) => {
      const settings = ColumnSettings[key] || {}

      const type = sqlData.types[i]
      if (type.includes('Date')) {
        dateColumns.push(key)

        if (!dateColumn) dateColumn = i.toString()

        return
      }

      if (type.includes('Int') === false && type.includes('Float') === false) {
        return
      }

      let format = settings.formatter?.format
      if (format.prototype) format = undefined

      metrics.push({
        key: i.toString(),
        header: key,
        title: settings.title || key,
        valueKey: i,
        color: COLORS[i],
        format,
      })
    })

    return { metrics, dateColumns, dateColumn: dateColumn! || '0' }
  }
</script>

<script lang="ts">
  import Chart from '$lib/Chart/index.svelte'
  import { COLORS } from '$lib/Parameter'
  import Metric from './Metric.svelte'

  let className = ''
  export { className as class }
  export let sqlData: App.SqlData
  export let ColumnSettings: any
  export let columns = undefined as undefined | any

  $: ({ metrics, dateColumn } = columns || getChartColumns(sqlData, ColumnSettings))
  $: data = getData(sqlData, dateColumn)

  function getData({ rows }: App.SqlData, dateColumn: string) {
    return rows
      .slice()
      .map((row: any[]) => {
        return Object.assign({}, row, { [dateColumn]: Date.parse(row[+dateColumn]) })
      })
      .sort((a, b) => a[dateColumn] - b[dateColumn])
  }
</script>

<metrics class="row gap-s mrg-s mrg--b">
  {#each metrics as metric}
    <Metric {metric} />
  {/each}
</metrics>

<Chart class={className} {data} {metrics} xAxisKey={dateColumn} />

<style>
  metrics {
    flex-wrap: wrap;
  }
</style>
