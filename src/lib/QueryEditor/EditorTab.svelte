<script lang="ts">
  import { untrack } from 'svelte'
  import SqlEditor from '$lib/SqlEditor/index.svelte'
  import { useQueryEditorCtx } from './ctx'

  let {
    readonly = true,
    onSqlChange,
  }: { readonly?: boolean; onSqlChange?: (saveEditorState: (queryId: number) => void) => void } =
    $props()

  const { queryEditor } = useQueryEditorCtx()

  let SqlEditorRef = $state<SqlEditor>()

  function onModelChange() {
    if (!SqlEditorRef) return

    const value = SqlEditorRef.getValue() ?? ''

    queryEditor.sql.$ = value

    onSqlChange?.((queryId) => untrack(() => SqlEditorRef?.saveState(queryId)))
  }
</script>

<SqlEditor
  bind:this={SqlEditorRef}
  {readonly}
  id={queryEditor.id}
  value={queryEditor.sql.$}
  {onModelChange}
></SqlEditor>
