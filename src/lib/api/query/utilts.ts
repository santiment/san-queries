export function serializeParameters(parameters: App.Parameter[]) {
  return JSON.stringify(
    parameters.reduce((acc, parameter) => {
      acc[parameter.key] = parameter.value
      return acc
    }, {} as Record<string, any>),
  )
}
