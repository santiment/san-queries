import { editor as monacoEditor, languages } from 'monaco-editor'
import { clickhouseLanguageDefinition as clickhouse } from '@popsql/monaco-sql-languages'
import { COLORS } from '$lib/Parameter/colors'
import { registerSuggestions } from './suggestions'

clickhouse.loader().then(({ language }) => {
  language.tokenizer.root.unshift({ include: '@annotations' })
  language.tokenizer.annotations = []
  language.keywords.push('SHOW')
})

const THEME = 'SAN'

monacoEditor.defineTheme(THEME, {
  base: 'vs',
  inherit: true,
  rules: [
    {
      foreground: '14C393',
      token: 'keyword',
    },
    {
      foreground: '8358FF',
      token: 'number',
    },
    {
      foreground: 'FFAD4D',
      token: 'string.sql',
    },
    {
      foreground: 'FF6363',
      token: 'predefined.sql',
    },
    {
      foreground: '505573',
      token: 'comment',
    },
  ].concat(
    COLORS.map((hex, i) => ({
      foreground: hex.slice(1),
      token: 'annotation.' + i,
    })),
  ),
  colors: {},
})

let id = 0
export async function createEditor(
  node: HTMLElement,
  value: string,
  options?: monacoEditor.IStandaloneEditorConstructionOptions,
) {
  const languageId = clickhouse.id + id++

  languages.register({ ...clickhouse, id: languageId })

  const { language, conf } = await clickhouse.loader()

  const _language = {
    ...language,
    tokenizer: { ...language.tokenizer },
  } as languages.IMonarchLanguage

  const { getSuggestions, updateParameterSuggestions } = registerSuggestions(_language)

  const suggestionsDisposal = languages.registerCompletionItemProvider(languageId, {
    provideCompletionItems: getSuggestions,
  })
  const confDisposal = languages.setLanguageConfiguration(languageId, conf)
  let monarchDisposal = languages.setMonarchTokensProvider(languageId, _language)

  function updateParameters(parameters: { key: string }[]) {
    updateParameterSuggestions(parameters)

    if (parameters.length === 0) return

    _language.tokenizer.annotations = parameters.map(({ key }, i) => [
      new RegExp(`{{${key}}}`),
      'annotation.' + i,
    ])
    monarchDisposal.dispose()

    monarchDisposal = languages.setMonarchTokensProvider(languageId, _language)
  }

  const editor = monacoEditor.create(node, {
    ...options,
    value,
    theme: THEME,
    language: languageId,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    renderLineHighlight: 'none',
    overviewRulerLanes: 0,
    scrollbar: { verticalScrollbarSize: 2, alwaysConsumeMouseWheel: false },
    padding: { top: 15, bottom: 15 },
    wordWrap: 'on',
    // @ts-ignore
    'bracketPairColorization.enabled': false,
  })

  function destroy() {
    confDisposal.dispose()
    monarchDisposal.dispose()
    suggestionsDisposal.dispose()
    editor.dispose()
  }

  return {
    editor,
    destroy,
    updateParameters,
  }
}

export type EditorCtxType = Awaited<ReturnType<typeof createEditor>>