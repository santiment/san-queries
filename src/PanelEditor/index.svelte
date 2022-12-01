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
  let { __computedSql } = panel

  $: computedSql = panel.__computedSql || { headers: [], rows: [], dateColumns: new Set() }
  $: triggerDashboardUpdate(panel)

  if (process.browser) {
    window.scroll(0, 0)
  }

  let unsubscribe
  if (!__computedSql) {
    unsubscribe = dashboard$.subscribe(() => {
      if (!panel.__computedSql) return

      panel = panel
      if (unsubscribe) unsubscribe()
    })
  }

  function onData(data) {
    computedSql = data
    panel.__rows = data.rows
    panel.__computedSql = data
  }

  function onNewParameter(parameter: string) {
    controller.setValue(editor.getValue() + ' ' + parameter)
  }

  onDestroy(() => {
    clearTimeout()
    if (unsubscribe) unsubscribe()
  })
</script>

<!-- <Header bind:panel bind:error {controller} {onData} /> -->

<SQLEditor bind:panel bind:editor bind:error {controller} />

<Result bind:panel {...computedSql} {computedSql} />
