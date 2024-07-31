import { v4 as uuidv4 } from 'uuid'
import { useDashboardEditorCtx } from '$lib/Dashboard/ctx'
import { createCtx } from '$lib/ctx'
import { ss } from 'svelte-runes'
import { SvelteMap as Map } from 'svelte/reactivity'
import { QueryWidgetFlowNode } from '../nodes/QueryWidgetFlowNode'
import type { Connection, Edge, Node } from '@xyflow/svelte'
import type { TCanvasNode } from '../nodes/QueryWidgetFlowNode/node.svelte'
import { SelectColumnFlowNode } from '../nodes/Interaction/SelectColumnFlowNode'
import { untrack } from 'svelte'
import { GlobalParameterFlowNode } from '../nodes/GlobalParameterFlowNode'
import { useOnClient } from '$lib/ui/utils/state.svelte'
import { useDashboardLayoutCtx } from '$lib/Dashboard/ctx/layout'
import { useDashboardWidgetsCtx } from '$lib/Dashboard/ctx/widgets'
import { AssetSelectorFlowNode } from '../nodes/AssetSelector'
import { getConnectionId } from '../nodes/GenericNode/node'
import { SelectColumnAlertFlowNode } from '../nodes/Interaction/SelectColumnAlertFlowNode'

export function createNode(
  createInstance: (node: TCanvasNode) => TCanvasNode['data']['instance'],
  props = {} as {
    id?: string
    position?: { x: number; y: number }
  },
): TCanvasNode {
  const { id = uuidv4(), position = { x: 0, y: 0 } } = props
  const data = {} as TCanvasNode['data']

  const node = { type: 'generic', ...props, position, data, id } as TCanvasNode
  Object.assign(data, { instance: createInstance(node) })

  return node
}

// TODO: Refactor :(
export const useDataFlowCtx = createCtx('useDataFlowCtx', () => {
  const { dashboardEditor } = useDashboardEditorCtx()
  const widgetsCtx = useDashboardWidgetsCtx()
  const layoutCtx = useDashboardLayoutCtx()

  const ctx = { widgetsCtx, layoutCtx }
  const { widgets, parameters, dataFlowSettings } = dashboardEditor

  const flowNodes = ss([] as TCanvasNode[])
  const flowConnections = ss([] as Edge[])
  const FlowNodeByWidgetId = new Map<string, QueryWidgetFlowNode>()

  useOnClient(() => {
    const queryWidgets = widgets.$.map((widget) =>
      widget.type === 'QUERY' ? widget : null,
    ).filter((v): v is App.Dashboard.QueryWidget => !!v)

    // if (dataFlowSettings.layoutWidgets.length) {
    //   dataFlowSettings.layoutWidgets.forEach((node) => {
    //     if (!node) return
    //     // layoutCtx.addItem(widgetsCtx.addWidget(node.type, node))
    //   })
    // }
    const { settings = {} } = dataFlowSettings || {}

    if (dataFlowSettings?.layoutWidgets.length) {
      dataFlowSettings.layoutWidgets.forEach((item) => {
        const id = item.id
        const { position } = settings[item.id] || {}

        if (item.type === 'ASSET_SELECTOR') {
          const node = createNode(
            (canvasNode) =>
              new AssetSelectorFlowNode(canvasNode, {
                widgetsCtx,
                layoutCtx,
                data: item.data,
                noWidgetAdd: true,
              }),
            { id, position },
          )

          FlowNodeByWidgetId.set(id, node.data.instance)

          flowNodes.$.push(node)
        }
      })
    }

    if (dataFlowSettings?.flowWidgets.length) {
      dataFlowSettings.flowWidgets.forEach((item) => {
        const id = item.id
        const { position } = settings[item.id] || {}

        if (item.type === SelectColumnFlowNode) {
          const node = createNode((canvasNode) => new SelectColumnFlowNode(canvasNode), {
            id,
            position,
          })

          // FlowNodeByWidgetId.set(id, node.data.instance)

          flowNodes.$.push(node)
        } else if (item.type === SelectColumnAlertFlowNode) {
          const node = createNode(
            (canvasNode) => new SelectColumnAlertFlowNode(canvasNode, { data: item.data }),
            {
              id,
              position,
            },
          )

          // FlowNodeByWidgetId.set(id, node.data.instance)

          flowNodes.$.push(node)
        }
      })
    }

    flowNodes.$.push(
      ...queryWidgets.map((queryWidget) => {
        const { id, title } = queryWidget
        const { position } = settings[id] || {}

        const node = createNode(
          (canvasNode) => new QueryWidgetFlowNode(canvasNode, { name: title }),
          { id, position },
        )

        FlowNodeByWidgetId.set(id, node.data.instance)

        return node
      }),
    )

    flowNodes.$.push(
      ...parameters.$.map((parameter) => {
        const { position } = settings[parameter.key] || {}

        const node = createNode((node) => new GlobalParameterFlowNode(node, parameter), {
          id: parameter.key,
          position,
        })

        return node
      }),
    )

    const autoConnections = new Set<string>()
    flowConnections.$.push(
      ...parameters.$.flatMap((parameter) => {
        const source = parameter.key
        const sourceHandle = 'value'

        return Array.from(parameter.overrides).map(([widgetId, parameterKey]) => {
          const connection = {
            source,
            sourceHandle,
            target: widgetId,
            targetHandle: parameterKey,
          } as Edge

          autoConnections.add((connection.id = getConnectionId(connection)))

          return connection
        })
      }),
    )

    dataFlowSettings.connections.forEach((connection) => {
      const edge = connection as Edge
      edge.id = getConnectionId(connection)

      if (autoConnections.has(edge.id)) return

      flowConnections.$.push(edge)
    })

    flowNodes.$.forEach((node) => {
      node.data.instance.onInit()
    })

    flowConnections.$.forEach((connection) => {
      onNewConnection(connection)
    })
  })

  function onNewConnection(connection: Connection) {
    untrack(() => {
      const nodes = flowNodes.$
      const edges = flowConnections.$

      const sourceNode = findNode(connection.source, nodes)
      const targetNode = findNode(connection.target, nodes)

      // TODO: Old saved connections (that are now invalid) still will trigger subscription
      if (targetNode && sourceNode) {
        sourceNode?.data.instance.onNewOutputConnection?.(targetNode, connection, { nodes, edges })
      }
    })
  }

  function onDelete(deleted: { nodes: TCanvasNode[]; edges: Edge[] }) {
    const deletedInstances = new Set(
      deleted.nodes.map((node) => {
        const instance = node.data.instance

        instance.destroy()
        if (instance.widget) {
          layoutCtx.removeItem(widgetsCtx.removeWidget(instance.widget))
          FlowNodeByWidgetId.delete(node.id)
        }

        return instance
      }),
    )

    if (deletedInstances.size) {
      flowNodes.$ = flowNodes.$.filter((node) => {
        return !deletedInstances.has(node.data.instance)
      })
    }

    if (deleted.edges.length) {
      const deletedEdges = new Set(deleted.edges.map(({ id }) => id))
      flowConnections.$ = flowConnections.$.filter((edge) => deletedEdges.has(edge.id) === false)
    }

    const data = { nodes: flowNodes.$, edges: flowConnections.$ }
    deleted.edges.forEach((edge) => {
      const sourceNode = findNode(edge.source, flowNodes.$)
      sourceNode?.data.instance.onDeletedOutputConnection(
        edge,
        data,
        findNode(edge.target, data.nodes),
      )
    })
  }

  function addFlowNode(Constructor: any, props?: { position?: string }) {
    const node = createNode((node) => new Constructor(node, ctx), props)

    FlowNodeByWidgetId.set(node.id, node.data.instance)
    flowNodes.$.push(node)
    flowNodes.$ = flowNodes.$

    node.data.instance.onInit({ nodes: flowNodes.$, edges: flowConnections.$ })
  }

  function removeFlowNode(flowNode: any) {}

  return {
    flowNodes,
    flowConnections,

    FlowNodeByWidgetId,

    addFlowNode,
    removeFlowNode,

    onNewConnection,
    onDelete,
  }
})

function findNode(nodeId: string, nodes: TCanvasNode[]): undefined | TCanvasNode {
  return nodes.find((node) => node.id === nodeId)
}
