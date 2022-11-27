<script lang="ts">
  import SQLEditor from './Query/index.svelte'
  import Result from './Result/index.svelte'

  export let panel

  const controller = { onNewParameter, onData }

  let editor
  let error = ''

  $: computedSql = panel.__computedSql || { headers: [], rows: [], dateColumns: new Set() }

  function onData(data) {
    computedSql = data
    panel.__rows = data.rows
    panel.__computedSql = data
  }

  function onNewParameter(parameter: string) {
    controller.setValue(editor.getValue() + ' ' + parameter)
  }
</script>

<!-- <Header bind:panel bind:error {controller} {onData} /> -->

<SQLEditor bind:panel bind:editor bind:error {controller} />

<Result bind:panel {...computedSql} {computedSql} />
