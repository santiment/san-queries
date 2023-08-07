import { editor as monacoEditor, languages } from 'monaco-editor'
import { clickhouseLanguageDefinition as clickhouse } from '@popsql/monaco-sql-languages'
import { registerSuggestions } from './suggestions'

clickhouse.loader().then(({ language }) => {
  language.tokenizer.root.unshift({ include: '@annotations' })
  language.tokenizer.annotations = []
  language.keywords.push('SHOW')
})

const THEME = 'SAN'

const COLORS = [
  '#FF5B5B', // RED
  '#FFCB47', // YELLOW
  '#5275FF', // BLUE
  '#FF8450', // SALMON
  '#F47BF7', // PURPLE
  '#785549', // BROWN
  '#D4E763', // YELLOW-GREEN
  '#FFDAC5', // PEACH
  '#37D7BA', // AQUAMARINE
  '#777777', // GREY
  '#AC948C', // BROWN-GRAY
  '#222222', // BLACK

  '#14c393', // jungle-green,
  '#7a859e', // waterloo
  '#174d4a', // jungle-green-dark-3
  '#ffe7ca', // texas-rose-light-2
  '#efa7a7', // persimmon-light-2
  '#dcf6ef', // jungle-green-light-2,
  '#3b3130', // texas-rose-dark,
  '#c9c2ff', // heliotrope-light-2
]

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
