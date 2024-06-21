import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { createCtx } from '$lib/ctx'
import { untrack } from 'svelte'
import { ss } from 'svelte-runes'

export const useDataRefreshPromptCtx = createCtx('useDataRefreshPromptCtx', () => {
  const { globalParameterByOverrides } = useGlobalParametersCtx()
  const changedParameters = ss(new Map<string, undefined | string>())

  let currentValues = null as null | [string, string][]
  let newValues = null as typeof currentValues

  $effect(() => {
    const parameters = globalParameterByOverrides.$

    if (!currentValues) {
      currentValues = unwrapParameters(parameters)
      return
    }

    const timer = untrack(() =>
      setTimeout(() => {
        const diff = new Map<string, undefined | string>(currentValues)
        const unsetParameters = new Set(diff.keys())

        newValues = unwrapParameters(parameters)

        newValues.forEach(([key, value]) => {
          const currentValue = diff.get(key)
          unsetParameters.delete(key)

          if (currentValue === value) {
            return diff.delete(key)
          }

          return diff.set(key, value)
        })

        for (const key of unsetParameters) {
          diff.set(key, undefined)
        }

        changedParameters.$ = diff
      }, 300),
    )
    return () => clearTimeout(timer)
  })

  function unwrapParameters(parameters: (typeof globalParameterByOverrides)['$']) {
    return [...parameters].map(([key, parameter]) => [key, parameter.value] as [string, string])
  }

  return { changedParameters }
})
