<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { editor as monacoEditor } from 'monaco-editor'
  import { createEditor } from './editor'

  let className = ''
  export { className as class }
  export let style = ''
  export let value = ''
  export let options: monacoEditor.IStandaloneEditorConstructionOptions | undefined
  export let parameters = [] as { key: string }[]

  let editorNode: HTMLElement
  let editor: monacoEditor.IStandaloneCodeEditor
  let EditorCtx: Awaited<ReturnType<typeof createEditor>>

  $: EditorCtx?.updateParameters(parameters)

  onMount(() => {
    createEditor(editorNode, value, options).then((ctx) => {
      EditorCtx = ctx
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
    height: 100%;
    flex: 1;

    :global {
      .monaco-editor-background,
      .margin {
        background: var(--white);
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
