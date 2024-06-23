import type { ViewProps } from 'tiptap-svelte-adapter'
import { untrack } from 'svelte'
import { Map as Map$ } from 'svelte/reactivity'
import {
  useCreateGlobalParameterFlow,
  useUpdateGlobalParameterFlow,
} from '$lib/Dashboard/GlobalParameters/flow'
import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'

const getRandomKey = () => Math.floor(Math.random() * 0xffffffff).toString()

export function useParametersWidgetFlow<GValue>(
  view: ViewProps['view'],
  {
    keyPrefix,
    defaultValue,
    type = 'string',
  }: { keyPrefix: string; defaultValue: GValue; type?: 'string' | 'stringList' },
) {
  const { dashboardEditor } = useDashboardEditorCtx()
  const { createGlobalParameter } = useCreateGlobalParameterFlow()
  const { updateGlobalParameter } = useUpdateGlobalParameterFlow()

  const attrs = $derived(view.$.node.attrs)
  const { globalParameters, globalParameterByKey } = useGlobalParametersCtx()
  const [parameter, value] = $derived(getParameter())

  $effect(() => {
    const data = attrs['data-value']
    untrack(() => {
      if (data !== value) update(data, false)
    })
  })

  function getParameter() {
    const key: string = attrs['data-id']
    const parameter = (key && globalParameterByKey.$.get(key)) || createParameter()

    return [parameter, parameter.value as GValue] as const
  }

  function createParameter() {
    return untrack(() => {
      const key = `${keyPrefix}-${getRandomKey()}`
      // @ts-expect-error
      attrs['data-id'] = key

      const parameter = {
        global: true,
        type: 'Text',
        key,
        value: attrs['data-value'] || defaultValue,
        overrides: new Map$<any, any>(),
      }

      createGlobalParameter({
        dashboard: dashboardEditor as { id: number },
        parameter,
        type,
        overrides: { added: [], deleted: [] },
        onComplete() {
          globalParameters.$.push(parameter)
          globalParameters.$ = globalParameters.$
        },
      })

      return parameter
    })
  }

  function update(value: GValue, shouldStoreUndoRedo = true) {
    parameter.value = value || defaultValue
    if (shouldStoreUndoRedo) view.$.updateAttributes({ 'data-value': value || defaultValue })
    globalParameters.$ = globalParameters.$

    if (dashboardEditor.readonly === false) {
      updateGlobalParameter({
        dashboard: dashboardEditor as { id: number },
        oldKey: parameter.key,
        parameter,
        type,
        overrides: { added: [], deleted: [] },
      })
    }

    view.$.editor.commands.focus(undefined, { scrollIntoView: false })
  }

  return {
    get $() {
      return value
    },
    get parameter() {
      return parameter
    },
    update,
  }
}
