<script lang="ts">
  import type { editor as monacoEditor } from 'monaco-editor'

  import { untrack, type Snippet } from 'svelte'
  import { cn } from '$lib/ui/utils'
  import { createEditor } from './editor'
  import { getEditorState, saveEditorState } from './utils'

  let {
    id,
    value = '',
    class: className = '',
    readonly = true,

    onModelChange,

    children,
  }: {
    id?: number | string
    value?: string
    class?: string
    readonly: boolean

    onModelChange?: (e: monacoEditor.IModelContentChangedEvent) => void

    children?: Snippet
  } = $props()

  let ctx = $state.raw<Awaited<ReturnType<typeof createEditor>>>()
  let sqlEditorNode = $state.raw<HTMLElement>()
  let width = $state<number>(0)
  let height = $state<number>(0)
  let isFocused = $state(false)

  $inspect(id)

  export function getValue() {
    return untrack(() => ctx?.editor?.getValue())
  }

  export function saveState(queryId = id) {
    untrack(() => {
      if (id !== queryId) id = queryId

      saveEditorState(ctx?.editor, queryId)
    })
  }

  function onFocus() {
    isFocused = true
  }

  function onBlur() {
    isFocused = false
    // onBlur(value)
  }

  $effect(() => {
    ctx?.editor?.updateOptions({ readOnly: readonly })
  })

  $effect(() => {
    // @ts-expect-error
    untrack(async () => {
      if (!sqlEditorNode) return

      const { model, viewState } = getEditorState(id)
      ctx = await createEditor(sqlEditorNode, value, { model })

      ctx.editor.onDidBlurEditorText(onBlur)
      ctx.editor.onDidFocusEditorWidget(onFocus)
      if (onModelChange) ctx.editor.onDidChangeModelContent(onModelChange)

      if (viewState) {
        ctx.editor.restoreViewState(viewState)
        ctx.editor.focus()
        onFocus()
      }
    })

    return () => {
      saveState()
      ctx?.editor.dispose()
    }
  })

  $effect(() => {
    ctx?.editor.layout({ width, height })
  })
</script>

<sql-editor
  bind:this={sqlEditorNode}
  bind:clientWidth={width}
  bind:clientHeight={height}
  class={cn('relative min-h-0 flex-1 rounded-md bg-white', className)}
>
  {#if !value && !isFocused}
    <placeholder class="pointer-events-none absolute left-[62px] top-[14px] z-[1] text-green">
      Write your SQL here...
    </placeholder>
  {/if}

  {@render children?.()}
</sql-editor>

<style>
  sql-editor :global {
    .monaco-editor {
      border-radius: var(--border-radius, inherit);
      background: var(--white);
      --vscode-editor-background: transparent;
      --vscode-focusBorder: transparent;
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
</style>
