<script lang="ts">
  import type { editor as monacoEditor } from 'monaco-editor'
  import type { EditorCtxType } from './editor'

  import { onDestroy, onMount } from 'svelte'
  import { noop } from 'webkit/utils'

  let className = ''
  export { className as class }
  export let style = ''
  export let value = ''
  export let options = undefined as monacoEditor.IStandaloneEditorConstructionOptions | undefined
  export let parameters = [] as App.Parameter[]
  export let editor = null as null | monacoEditor.IStandaloneCodeEditor
  export let onValueChange = noop as (value: string) => void
  export let onSave = noop as () => void

  let editorNode: HTMLElement
  let EditorCtx: EditorCtxType
  let isFocused = false
  let resizerNode: HTMLIFrameElement

  $: EditorCtx?.updateParameters(parameters)
  $: setValue(value)

  function setValue(value: string) {
    // editor?.setValue(value)
  }

  function getValue() {
    return editor?.getValue() ?? value
  }

  function onFocus() {
    isFocused = true
  }

  function onBlur() {
    isFocused = false
    value = getValue()
    onValueChange(value)
  }

  function onResize() {
    if (editor) {
      const { offsetWidth: width, offsetHeight: height } = resizerNode
      editor.layout({ width, height })
    }
  }

  onMount(() => {
    if (resizerNode.contentWindow) resizerNode.contentWindow.onresize = onResize

    import('./editor').then(({ createEditor }) => {
      createEditor(editorNode, value, options).then((ctx) => {
        EditorCtx = ctx
        editor = ctx.editor

        console.log(editor)

        editor.onDidBlurEditorText(onBlur)
        editor.onDidFocusEditorWidget(onFocus)

        editor.onKeyDown((e) => {
          if (e.keyCode === 49 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()

            value = getValue()
            onValueChange(value)
            onSave()
          }
        })
      })
    })
  })

  onDestroy(() => {
    if (process.browser && EditorCtx) {
      EditorCtx.destroy()
    }
  })
</script>

<sql-editor bind:this={editorNode} {style} class="relative {className}">
  {#if !value && !isFocused}
    <placeholder class="c-green">Write your SQL here...</placeholder>
  {/if}

  <iframe title="resizer" frameBorder="0" bind:this={resizerNode} />

  <slot />
</sql-editor>

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

  placeholder {
    position: absolute;
    left: 62px;
    top: 14px;
    pointer-events: none;
    z-index: 1;
  }

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    top: 0;
  }
</style>
