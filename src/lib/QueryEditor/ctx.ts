import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { z } from 'zod'
import { FormatType } from '$lib/Visualization/format'
import { createCtx } from '$lib/ctx'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import { shareParameters } from './api'

// type SharedFormatterType = `${(typeof FormatType)[keyof typeof FormatType]}`
// const formatter = Object.values(FormatType).map((v) => v.toString() as SharedFormatterType)

const FORMATTERS = new Set<number>(Object.values(FormatType))

export const ColumnSettingsSchema = z
  .object({
    title: z.string().trim().min(1).optional().catch(undefined),
    formatter: z.coerce
      .number()
      .refine((value) => FORMATTERS.has(value))
      .optional()
      .catch(undefined),
    chartNode: z
      .enum(['Line', 'Bars', 'Area'])
      .optional()
      .catch(() => 'Line' as const),
    isHiddenOnChart: z.boolean().optional(),
    chartColor: z.string().optional(),
  })
  .partial()

export const QuerySettingsSchema = z
  .object({
    visualisation: z.enum(['Table', 'Chart']).catch('Table'),
    columns: z.record(z.string(), ColumnSettingsSchema.optional().catch({})).default({}),
    sort: z.object({ column: z.string(), dir: z.enum(['asc', 'desc']).catch('desc') }).optional(),
  })
  .default({})

export type QuerySettingsType = z.infer<typeof QuerySettingsSchema>

export const useQuerySettingsCtx = createCtx(
  'useQuerySettingsCtx',
  (querySettings?: Partial<QuerySettingsType>) => {
    const changeIndicatorCtx = useChangeIndicatorCtx()
    const result = QuerySettingsSchema.safeParse(querySettings)

    const settings = ss(result.success ? result.data : ({} as QuerySettingsType))
    const update = () => (settings.$ = untrack(() => settings.$))

    return {
      settings,

      setVisualisation(value: QuerySettingsType['visualisation']) {
        settings.$.visualisation = value
        update()
        changeIndicatorCtx.emit.changed()
      },

      applyColumnSettings(column: string, value: z.infer<typeof ColumnSettingsSchema>) {
        settings.$.columns[column] = { ...settings.$.columns[column], ...value }
        update()
        changeIndicatorCtx.emit.changed()
      },
    }
  },
)

export const useQueryEditorCtx = createCtx('useQueryEditorCtx', (apiQuery?: App.ApiQuery) => {
  const { id, name, description, settings, sqlQueryText, sqlQueryParameters, isPublic } =
    apiQuery || {}

  const querySettingsCtx = useQuerySettingsCtx(settings)

  return {
    queryEditor: {
      id,
      name: ss(name || ''),
      description: ss(description || ''),
      sql: ss(sqlQueryText || ''),
      isPublic: ss(isPublic),
      settings: querySettingsCtx.settings,
      parameters: ss(parseQueryParameters(sqlQueryParameters)),
    },
  }
})

export function unwrapState(queryEditor: ReturnType<typeof useQueryEditorCtx>['queryEditor']) {
  const { id, name, description, sql, parameters, settings, isPublic } = queryEditor

  const _parameters = parameters.$
  return {
    id,
    name: name.$,
    description: description.$,
    sql: sql.$,
    settings: settings.$,
    parameters: _parameters,
    apiParameters: _parameters.length ? shareParameters(_parameters) : null,
    isPublic: isPublic.$,
  }
}

export function parseQueryParameters(parameters?: App.ApiQuery['sqlQueryParameters']) {
  return parameters
    ? Object.keys(parameters).map((key) => ({
        key,
        type: 'Text',
        value: parameters[key],
      }))
    : []
}

declare global {
  namespace App {
    type ColumnSettings = QuerySettingsType['columns']
    type ApiQuerySettings = QuerySettingsType
    type QueryEditor = ReturnType<typeof unwrapState>
  }
}
