<script lang="ts">
  import Chart from '$lib/Chart/index.svelte'

  let className = ''
  export { className as class }
  export let sqlData: App.SqlData
  export let ColumnSettings: any

  $: ({ metrics, dateColumn } = getMetrics(sqlData))
  $: data = getData(sqlData, dateColumn)

  function getMetrics(sqlData: App.SqlData) {
    const metrics = [] as any[]

    let dateColumn = '0'
    let isLookingForDate = true

    sqlData.headers.forEach((key, i) => {
      const settings = ColumnSettings[key] || {}

      const type = sqlData.types[i]
      if (isLookingForDate && type.includes('Date')) {
        dateColumn = i.toString()
        isLookingForDate = false
        return
      }

      if (type.includes('Int') === false && type.includes('Float') === false) {
        return
      }

      metrics.push({
        key: i.toString(),
        title: settings.title || key,
        valueKey: i,
      })
    })

    return { metrics, dateColumn }
  }

  function getData({ rows }: App.SqlData, dateColumn: string) {
    return rows
      .slice()
      .map((row: any[]) => {
        return Object.assign({}, row, { [dateColumn]: Date.parse(row[+dateColumn]) })
      })
      .sort((a, b) => a[dateColumn] - b[dateColumn])
  }
</script>

<Chart class={className} {data} {metrics} xAxisKey={dateColumn} />

<style>
</style>
