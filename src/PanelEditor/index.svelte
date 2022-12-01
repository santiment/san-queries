<script lang="ts">
  import { debounce } from 'webkit/utils/fn'
  import { getAppContext } from '@/context'
  import SQLEditor from './Query/index.svelte'
  import Result from './Result/index.svelte'
  import { onDestroy } from 'svelte'

  const { dashboard$ } = getAppContext()
  const [triggerDashboardUpdate, clearTimeout] = debounce(250, () => {
    dashboard$.set($dashboard$)
  })

  export let panel

  const controller = { onNewParameter, onData }

  let editor
  let error = ''

  $: computedSql = panel.__computedSql || { headers: [], rows: [], dateColumns: new Set() }
  $: triggerDashboardUpdate(panel)

  if (process.browser) {
    window.scroll(0, 0)
  }

  function onData(data) {
    computedSql = data
    panel.__rows = data.rows
    panel.__computedSql = data
  }

  function onNewParameter(parameter: string) {
    controller.setValue(editor.getValue() + ' ' + parameter)
  }

  onDestroy(clearTimeout)
</script>

<!-- <Header bind:panel bind:error {controller} {onData} /> -->

<SQLEditor bind:panel bind:editor bind:error {controller} />

<Result bind:panel {...computedSql} {computedSql} />
