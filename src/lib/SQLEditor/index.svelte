<script lang="ts">
  import type { editor as monacoEditor } from 'monaco-editor'
  import type { EditorCtxType } from './editor'

  import { onDestroy, onMount } from 'svelte'

  let className = ''
  export { className as class }
  export let style = ''
  export let value = ''
  export let options = undefined as monacoEditor.IStandaloneEditorConstructionOptions | undefined
  export let parameters = [] as { key: string }[]
  export let editor = null as null | monacoEditor.IStandaloneCodeEditor

  let editorNode: HTMLElement
  let EditorCtx: EditorCtxType

  $: EditorCtx?.updateParameters(parameters)

  onMount(() => {
    import('./editor').then(({ createEditor }) => {
      createEditor(editorNode, value, options).then((ctx) => {
        EditorCtx = ctx
        editor = ctx.editor
      })
    })
  })

  onDestroy(() => {
    if (process.browser && EditorCtx) {
      EditorCtx.destroy()
    }
  })
</script>

<sql-editor bind:this={editorNode} {style} class={className} />

<style lang="scss">
  sql-editor {
    flex: 1;
    background: var(--white);
    border-radius: var(--border-radius, 0);

    :global {
      .monaco-editor {
        border-radius: var(--border-radius, 0);
        background: var(--white);
        --vscode-editor-background: transparent;
        --vscode-editorGutter-background: transparent;
        --vscode-list-hoverBackground: var(--mystic);
      }

      .mtk1 {
        color: var(--black);
      }

      .line-numbers {
        color: var(--waterloo);
      }

      .active-line-number {
        color: var(--black) !important;
      }
      .cursors-layer .cursor {
        background-color: var(--black);
        border-color: var(--black);
      }

      .suggest-widget {
        border-radius: 4px;
        background: var(--white);
        --vscode-editorSuggestWidget-foreground: var(--black);
      }
    }
  }
</style>
