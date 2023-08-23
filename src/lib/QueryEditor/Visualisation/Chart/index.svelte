<script lang="ts">
  import Chart from '$lib/Chart/index.svelte'

  let className = ''
  export { className as class }
  export let sqlData: any
  export let ColumnSettings: any

  $: ({ metrics, dateColumn } = getMetrics(sqlData))
  $: data = getData(sqlData, dateColumn)

  function getMetrics(sqlData: any) {
    const metrics = [] as any[]

    let dateColumn = '0'
    let isLookingForDate = true

    sqlData.headers.forEach((key, i) => {
      const settings = ColumnSettings[key] || {}

      const type = sqlData.types[i]
      if (isLookingForDate && type === 'DateTime') {
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

  function getData({ rows }, dateColumn) {
    return rows
      .slice()
      .map((row: any[]) => {
        return Object.assign({}, row, { [dateColumn]: Date.parse(row[dateColumn]) })
      })
      .sort((a, b) => a[dateColumn] - b[dateColumn])
  }
</script>

<Chart class={className} {data} {metrics} xAxisKey={dateColumn} />

<style>
</style>
