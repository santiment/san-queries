import { editor, languages } from 'monaco-editor'
import { language } from 'monaco-clickhouse/src/basic-languages/clickhouse/clickhouse'
import { COLORS } from 'studio/Chart/colors'

export const THEME = 'SAN'

editor.defineTheme(THEME, {
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

export function updateThemeParameters(parameters: SAN.Queries.PanelParameter[]) {
  language.tokenizer.annotations = parameters.map(({ key }, i) => [
    new RegExp(`{{${key}}}`),
    'annotation.' + i,
  ])

  languages.setMonarchTokensProvider('clickhouse', language)
}
