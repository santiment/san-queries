<script lang="ts">
  import Header from './Query/Header.svelte'
  import SQLEditor from './Query/SQLEditor.svelte'
  import Result from './Result/index.svelte'

  export let panel

  const controller = { onNewParameter }

  let editor
  let computedSql = panel.__computedSql || { headers: [], rows: [], dateColumns: new Set() }
  let error = ''

  function onData(data) {
    computedSql = data
    panel.__rows = data.rows
    panel.__computedSql = data
  }

  function onNewParameter(parameter: string) {
    controller.setValue(editor.getValue() + ' ' + parameter)
  }
</script>

<Header bind:panel bind:error {controller} {onData} />

<SQLEditor bind:panel bind:editor bind:error {controller} />

<Result bind:panel {...computedSql} {computedSql} />
