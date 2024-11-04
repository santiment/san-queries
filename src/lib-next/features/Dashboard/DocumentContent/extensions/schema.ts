type TGlobalParameterSchema = {
  name: string
  keyPrefix: string

  initState(defaultState?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }
}
export type TGlobalParameterNode = ReturnType<typeof createGlobalParameterSchema>

export function createGlobalParameterSchema<GSchema extends TGlobalParameterSchema>(
  schema: GSchema,
) {
  return {
    isGlobalParameter: true,

    name: schema.name as GSchema['name'],
    keyPrefix: schema.keyPrefix as GSchema['keyPrefix'],

    initState: schema.initState as GSchema['initState'],
    initSettings: schema.initSettings as GSchema['initSettings'],
  } as const
}
