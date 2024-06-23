import type { useParametersWidgetFlow } from '../parameters.svelte'

import { createCtx } from 'san-webkit-next/utils'
import Header from './Header.svelte'
import Cell from './Cell.svelte'

export const useControllerListCtx = createCtx(
  'useControllerListCtx',
  (_state?: ReturnType<typeof useParametersWidgetFlow<string[]>>) => {
    const state = _state!

    function addInputValue(value: string) {
      state.update(Array.from(new Set([...state.$, value])))
    }

    function deleteItem(value: string) {
      const set = new Set(state.$)
      set.delete(value)
      state.update(Array.from(set))
    }

    function resetList() {
      state.update([])
    }

    return { addInputValue, deleteItem, resetList }
  },
)

export const COLUMNS = [
  {
    key: 'Selected items',
    title: 'Selected items',
    valueKey: '0',
    Header,
    Cell,
    className: 'group',
  },
]
