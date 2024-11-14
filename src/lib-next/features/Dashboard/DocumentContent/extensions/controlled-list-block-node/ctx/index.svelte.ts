import type { CONTROLLED_LIST_BLOCK_NODE } from '../schema'
import type { ViewProps } from 'tiptap-svelte-adapter'

import { createCtx } from 'san-webkit-next/utils'
import {
  useParameterWidgetFlow,
  type TDashboardParameterWidget,
} from '$lib-next/features/Dashboard/ctx/parameter-widgets.svelte'
import {
  useDashboardDataWidgets,
  type TDashboardDataWidgetByType,
} from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import Cell from '../ui/Cell.svelte'
import Header from '../ui/Header.svelte'

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
    widget: TDashboardParameterWidget<typeof CONTROLLED_LIST_BLOCK_NODE>,
  ) => {
    const { getDataWidget } = useDashboardDataWidgets.get()
    const { globalParameter, update } = useParameterWidgetFlow(view, widget)
    const { outputs, settings } = widget

    const linkedSqlDataWidget = $derived.by(() => {
      const { linkedQuery } = settings.$$
      if (!linkedQuery) return null

      const dataWidget = getDataWidget(linkedQuery)
      if (dataWidget?.type !== 'query-widget') return null

      return dataWidget as TDashboardDataWidgetByType['query-widget']
    })

    function addInputValue(value: string) {
      update('value', Array.from(new Set([...outputs.$$.value, value])))
    }

    function deleteItem(value: string) {
      const set = new Set(outputs.$$.value)
      set.delete(value)
      update('value', Array.from(set))
    }

    function resetList() {
      update('value', [])
    }

    $effect(() => {
      const { linkedColumn, linkedQuery } = settings.$$

      if (!linkedQuery || linkedColumn === undefined) {
        return
      }

      if (!linkedSqlDataWidget) {
        return
      }

      const columnActions = linkedSqlDataWidget.state.$$.__columnActions
      const column = linkedColumn.toString()

      columnActions.set(column, {
        label: 'Add to a list',
        onclick: (value: string) => {
          addInputValue(value)
        },
      })

      return () => {
        columnActions.delete(column)
      }
    })

    return {
      globalParameter,
      update,

      addInputValue,
      deleteItem,
      resetList,
      linkedSqlDataWidget: {
        get $() {
          return linkedSqlDataWidget
        },
      },
    }
  },
)
