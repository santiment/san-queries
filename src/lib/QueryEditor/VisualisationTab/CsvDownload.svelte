<script lang="ts">
  import { downloadCsv } from 'san-webkit/lib/utils/csv'
  import { track } from 'san-webkit/lib/analytics'
  import Button from '$lib/ui/Button.svelte'
  import { TABS, type TabType } from '../Tabs.svelte'
  import { useQueryEditorCtx } from '../ctx'

  let {
    selectedTab,
    sqlData,
  }: {
    selectedTab: TabType
    sqlData: App.SqlData
  } = $props()

  const { queryEditor } = useQueryEditorCtx()

  function onClick() {
    const { id, name } = queryEditor

    const columns = sqlData.columns.map((title, i) => ({ title, format: (v) => v[i] }))

    downloadCsv(name.$, columns, sqlData.rows)

    track.event('download', {
      category: 'Interaction',
      type: 'csv',
      source: 'query_editor_visualisation',
      id,
      source_url: window.location.href,
    })
  }
</script>

{#if selectedTab === TABS[1]}
  <Button
    icon="download"
    class="px-2 text-waterloo hover:fill-green hover:text-green"
    explanation="Download CSV"
    onclick={onClick}
  >
    CSV
  </Button>
{/if}
