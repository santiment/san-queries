import type * as monaco from 'monaco-editor'

import { languages } from 'monaco-editor'

export function getKeywordsSchema(language: monaco.languages.IMonarchLanguage) {
  let sort = 0
  return (language.keywords as string[]).map((word) => ({
    label: word,
    insertText: word,
    detail: 'Keyword',
    kind: languages.CompletionItemKind.Keyword,
    sortText: 'A' + sort++,
  }))
}

export function getTablesSchema() {
  return import('$static/schema/tables.json').then(({ default: data }) => {
    let sort = 0
    return (data as [string, string][]).map(([name, engine]) => ({
      label: name,
      insertText: name,
      detail: engine,
      sortText: 'B' + sort++,
      // documentation: id,
      kind: languages.CompletionItemKind.Interface,
    }))
  })
}

export function getColumnsSchema() {
  return import('$static/schema/table-columns.json').then(({ default: data }) => {
    let sort = 0
    return (data as [string, [string, string][]][])
      .map(([table, columns]) =>
        columns.map(([name, type]) => ({
          label: name,
          insertText: name,
          detail: type + ' in ' + table,
          sortText: 'C' + sort++,
          kind: languages.CompletionItemKind.Field,
        })),
      )
      .flat()
  })
}

export function getFunctionsSchema() {
  return import('$static/schema/functions.json').then(({ default: data }) => {
    let sort = 0

    return (data as string[]).map((name) => ({
      label: name,
      insertText: name + '($0)',
      detail: 'Function',
      sortText: 'D' + sort++,
      kind: languages.CompletionItemKind.Function,
      insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }))
  })
}

export function getParametersSchema(parameters: { key: string }[]) {
  return parameters.map(({ key }) => ({
    label: key,
    insertText: key,
    detail: 'Parameter',
    kind: languages.CompletionItemKind.Field,
  }))
}

export function registerSuggestions(language: monaco.languages.IMonarchLanguage) {
  const keywords = getKeywordsSchema(language)

  let schema = keywords
  let parameterSuggestions = [] as languages.CompletionItem[]

  Promise.all([getTablesSchema(), getColumnsSchema(), getFunctionsSchema()]).then((data) => {
    schema = schema.concat(data.flat())
  })

  function updateParameterSuggestions(parameters: { key: string }[]) {
    parameterSuggestions = getParametersSchema(parameters) as languages.CompletionItem[]
  }

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
        suggestions: parameterSuggestions,
      }
    }

    return {
      suggestions: schema.map((v) => Object.assign({ range }, v)),
    }
  }

  return { getSuggestions, updateParameterSuggestions }
}
