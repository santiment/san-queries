import { languages } from 'monaco-editor'
import { language } from 'monaco-clickhouse/src/basic-languages/clickhouse/clickhouse'
import 'monaco-clickhouse/src/basic-languages/clickhouse/clickhouse.contribution'

export function getKeywordsSchema() {
  let sort = 0
  return language.keywords.map((word: string) => ({
    label: word,
    insertText: word,
    detail: 'Keyword',
    kind: languages.CompletionItemKind.Keyword,
    sortText: 'A' + sort++,
  }))
}

export function getTablesSchema() {
  return import('../../public/schema/tables.json').then(({ default: data }) => {
    let sort = 0
    return data.map(([name, engine]) => ({
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
  return import('../../public/schema/table-columns.json').then(({ default: data }) => {
    let sort = 0
    return data
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

export function getFunsctionsSchema() {
  return import('../../public/schema/functions.json').then(({ default: data }) => {
    let sort = 0
    return data.map((name) => ({
      label: name,
      insertText: name + '($0)',
      detail: 'Function',
      sortText: 'D' + sort++,
      kind: languages.CompletionItemKind.Function,
      insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }))
  })
}

export function getParametersSchema(parameters: SAN.Queries.PanelParameter[]) {
  return parameters.map(({ key }) => ({
    label: key,
    insertText: key,
    detail: 'Parameter',
    kind: languages.CompletionItemKind.Field,
  }))
}
