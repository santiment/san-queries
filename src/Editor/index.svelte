<script lang="ts">
  import type * as monaco from 'monaco-editor'
  import { onMount } from 'svelte'
  import { editor as monacoEditor, languages } from 'monaco-editor'
  import {
    getColumnsSchema,
    getFunsctionsSchema,
    getKeywordsSchema,
    getParametersSchema,
    getTablesSchema,
  } from './schema'
  import { THEME } from './theme'

  let className = ''
  export { className as class }
  export let editor
  export let value: string
  export let parameters: any[]

  let editorNode: HTMLElement

  const KEYWORDS = getKeywordsSchema()
  let FNS = []
  getFunsctionsSchema().then((schema) => (FNS = schema))
  let TABLES = []
  getTablesSchema().then((schema) => (TABLES = schema))
  let COLUMNS = []
  getColumnsSchema().then((schema) => (COLUMNS = schema))

  $: schema = KEYWORDS.concat(TABLES).concat(COLUMNS).concat(FNS)
  $: setValue(value)

  function setValue(value: string) {
    console.log(value)
    editor?.setValue(value)
  }

  onMount(() => {
    editor = monacoEditor.create(editorNode, {
      value,
      theme: THEME,
      language: 'clickhouse',
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      renderLineHighlight: 'none',
      overviewRulerLanes: 0,
      scrollbar: { verticalScrollbarSize: 2, alwaysConsumeMouseWheel: false },
      padding: { top: 15, bottom: 15 },
    })

    editorNode.parentNode.ondragover = (e) => e.preventDefault()
    editorNode.parentNode.ondrop = (e) => {
      const target = editor.getTargetAtClientPoint(e.clientX, e.clientY)
      const { startColumn, startLineNumber } = target.range
      editor.executeEdits('parameters', [
        {
          range: {
            startColumn,
            startLineNumber,
            endColumn: startColumn,
            endLineNumber: startLineNumber,
          },
          text: e.dataTransfer.getData('text'),
        },
      ])
      editor.pushUndoStop()
    }

    languages.registerCompletionItemProvider('clickhouse', {
      provideCompletionItems: getSuggestions,
    })

    function getSuggestions(
      model: monaco.editor.IReadOnlyModel,
      position: monaco.Position,
    ): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const wholeWord = model.getValueInRange({
        ...range,
        startColumn: range.startColumn - 2,
        endColumn: range.endColumn + 2,
      })

      if (wholeWord.startsWith('{{') && wholeWord.endsWith('}}')) {
        return {
          suggestions: getParametersSchema(parameters),
        }
      }

      return {
        suggestions: schema.map((v) => Object.assign({ range }, v)),
      }
    }
  })
</script>

<div bind:this={editorNode} class={className} />

<style lang="scss">
  div {
    height: 100%;

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
