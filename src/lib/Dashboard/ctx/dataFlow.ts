import {
  CustomFlowNodeTypeId,
  FlOW_WIDGET_NODES,
  LAYOUT_FlOW_NODES,
  TypeIdToCustomFlowNode,
} from '$lib/DataFlow/nodes'
import { AssetSelectorFlowNode } from '$lib/DataFlow/nodes/AssetSelector'
import { z } from 'zod'

export function shareDataFlow(dataFlowCtx?: any) {
  const flowNodes = dataFlowCtx.flowNodes.$ || []
  const flowConnections = dataFlowCtx.flowConnections.$ || []

  const settings = flowNodes.reduce((acc, node) => {
    return { ...acc, [node.id]: { xy: [node.position.x, node.position.y] } }
  }, {})

  // Custom widgets to data flow
  const widgets = flowNodes
    .map((node) => {
      const { instance } = node.data

      let widget

      if (instance) {
        if (instance.getWidgetValue) {
          return {
            id: node.id,
            type: CustomFlowNodeTypeId.get(instance.constructor),
            data: instance.getWidgetValue(),
          }
        }

        if (FlOW_WIDGET_NODES.has(instance?.constructor)) {
          return {
            id: node.id,
            type: CustomFlowNodeTypeId.get(instance.constructor),
          }
        }
      }

      return widget
    })
    .filter(Boolean)

  const connections = flowConnections.map(({ source, sourceHandle, target, targetHandle }) => ({
    source,
    sourceHandle,
    target,
    targetHandle,
  }))

  return {
    connections,
    widgets,
    settings,
  }
}

export const DashboardDataFlowSchema_v0 = z
  .object({
    settings: z
      .record(
        z.string(),
        z
          .object({
            xy: z.tuple([z.number(), z.number()]).transform(([x, y]) => ({ x, y })),
          })
          .transform(({ xy }) => ({ position: xy })),
      )
      .nullable()
      .default({})
      .catch({}),
    widgets: z
      .array(
        z.object({
          id: z.string(),
          type: z.coerce.string().catch(''),
          data: z.any().optional(),
        }),
      )
      .default([])
      .catch([]),

    connections: z
      .array(
        z.object({
          source: z.string(),
          sourceHandle: z.string().optional(),
          target: z.string(),
          targetHandle: z.string().optional(),
        }),
      )
      .default([])
      .catch([]),
  })
  .default({ settings: {}, widgets: [], connections: [] })
  .catch({ settings: {}, widgets: [], connections: [] })

export function parseDataFlowSettings(
  dataFlowSettings?: z.infer<typeof DashboardDataFlowSchema_v0>,
) {
  const result = DashboardDataFlowSchema_v0.safeParse(dataFlowSettings)
  const { settings, widgets, connections } = result.success
    ? result.data
    : { settings: {}, widgets: [], connections: [] }

  const layoutWidgets = widgets
    .map((widget) => {
      const type = TypeIdToCustomFlowNode.get(widget.type)
      if (!type) return

      if (type === AssetSelectorFlowNode) {
        widget.type = 'ASSET_SELECTOR'
      }

      if (LAYOUT_FlOW_NODES.has(type)) {
        return widget
      }
    })
    .filter(Boolean)

  const flowWidgets = widgets
    .map((widget) => {
      const type = TypeIdToCustomFlowNode.get(widget.type)
      if (!type) return

      widget.type = type

      if (FlOW_WIDGET_NODES.has(type)) {
        return widget
      }
    })
    .filter(Boolean)

  return { settings, layoutWidgets, flowWidgets, connections }
}
