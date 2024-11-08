import type { CONTROLLED_LIST_BLOCK_NODE } from '../schema'
import type { ViewProps } from 'tiptap-svelte-adapter'

import { createCtx } from 'san-webkit-next/utils'
import Cell from '../ui/Cell.svelte'
import Header from '../ui/Header.svelte'
import {
  useGlobalParameterWidgetFlow,
  type TDashboardGlobalParameter,
} from '$lib-next/features/Dashboard/ctx/global-parameters.svelte'

export const COLUMNS = [
  {
    key: 'Selected items',
    title: 'Selected items',
    valueKey: '0',
    Header,
    Cell,
    className: 'group cell-visible',
  },
]

export const useControllerListCtx = createCtx(
  'dashboards_useControllerListCtx',
  (
    view: ViewProps['view'],
    widget: TDashboardGlobalParameter<typeof CONTROLLED_LIST_BLOCK_NODE>,
  ) => {
    const { globalParameter, update } = useGlobalParameterWidgetFlow(view, widget)
    const { state } = widget

    function addInputValue(value: string) {
      update('value', Array.from(new Set([...state.$$.value, value])))
    }

    function deleteItem(value: string) {
      const set = new Set(state.$$.value)
      set.delete(value)
      update('value', Array.from(set))
    }

    function resetList() {
      update('value', [])
    }

    return { globalParameter, addInputValue, deleteItem, resetList }
  },
)
