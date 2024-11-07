<script lang="ts">
  import { ssd } from 'svelte-runes'
  import Table from '$lib/Visualization/Table'
  import { useQuerySettingsCtx } from '$lib/QueryEditor/ctx'

  type TProps = { sqlQuery: App.ApiQueryWidget; sqlData: App.SqlData }
  let { sqlQuery, sqlData }: TProps = $props()

  console.log(sqlQuery.settings)
  const { settings } = useQuerySettingsCtx(sqlQuery.settings)
  let columnSettings = ssd(() => settings.$.columns)
</script>

<Table {sqlData} settings={columnSettings}></Table>
