<script lang="ts">
  import { onMount } from 'svelte'
  import { editor as monacoEditor, languages } from 'monaco-editor'
  import { clickhouseLanguageDefinition as clickhouse } from '@popsql/monaco-sql-languages'
  import { getKeywordsSchema } from './schema'

  let className = ''
  export { className as class }
  export let style = ''
  export let value = ''
  export let options: monacoEditor.IStandaloneEditorConstructionOptions | undefined

  const KEYWORDS = getKeywordsSchema()

  let editorNode: HTMLElement
  let editor: monacoEditor.IStandaloneCodeEditor

  $: schema = KEYWORDS

  onMount(() => {
    languages.register(clickhouse)
    languages.onLanguage(clickhouse.id, () => {
      clickhouse.loader().then(({ conf, language }) => {
        console.log(language)
        languages.setMonarchTokensProvider(clickhouse.id, language)
        languages.setLanguageConfiguration(clickhouse.id, conf)
      })
    })

    editor = monacoEditor.create(editorNode, {
      ...options,
      value,
      // theme: THEME,
      language: 'clickhouse',
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      renderLineHighlight: 'none',
      overviewRulerLanes: 0,
      scrollbar: { verticalScrollbarSize: 2, alwaysConsumeMouseWheel: false },
      padding: { top: 15, bottom: 15 },
      wordWrap: 'on',
    })
  })
</script>

<sql-editor bind:this={editorNode} {style} class={className} />

<style>
  sql-editor {
    height: 100%;
    flex: 1;
  }
</style>
