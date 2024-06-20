import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'

import { untrack } from 'svelte'
import { useDeleteDashboardQueryFlow } from '$lib/Dashboard/flow/widgets'
import { useDeleteGlobalParameterFlow } from '$lib/Dashboard/GlobalParameters/flow'
import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { useDashboardEditorCtx, useDashboardWidgets } from './ctx'
import QueryBlock from './BlockEditor/nodes/QueryBlock'

export function useCleanFlow(getEditor: () => null | Editor) {
  const { dashboardEditor } = useDashboardEditorCtx()
  const { dashboardWidgets } = useDashboardWidgets()
  const { globalParameterByKey, removeGlobalParameter } = useGlobalParametersCtx()
  const { deleteDashboardQuery } = useDeleteDashboardQueryFlow()
  const { deleteGlobalParameter } = useDeleteGlobalParameterFlow()

  $effect(() =>
    untrack(() => {
      const { id, isAuthor } = dashboardEditor
      if (!id || !isAuthor) return

      const editor = getEditor()
      if (!editor) return

      const unusedWidgets = new Map(dashboardWidgets)
      const unusedGlobalParameters = new Map(globalParameterByKey.$)
      const queryNodes = new Set<Node>()

      editor.state.doc.descendants((node) => {
        if (node.type.name === QueryBlock.name) {
          queryNodes.add(node)
          return
        }

        return true
      })
      console.log(editor)

      for (const node of queryNodes) {
        unusedWidgets.delete(node.attrs['data-id'])
      }

      unusedWidgets.forEach((widget) => {
        deleteDashboardQuery({ dashboardId: id, widget })
      })
      unusedGlobalParameters.forEach((parameter) => {
        deleteGlobalParameter({ dashboardId: id, parameter })
        removeGlobalParameter(parameter)
      })
    }),
  )
}
