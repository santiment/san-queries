import { AssetSelectorFlowNode } from './AssetSelector'
import { SelectColumnAlertFlowNode } from './Interaction/SelectColumnAlertFlowNode'
import { SelectColumnFlowNode } from './Interaction/SelectColumnFlowNode'

export const LAYOUT_FlOW_NODES = new Set([AssetSelectorFlowNode])

export const FlOW_WIDGET_NODES = new Set([SelectColumnFlowNode, SelectColumnAlertFlowNode])

// DO NOT CHANGE ORDER
export const CustomFlowNodeTypeId = new Map<any, string>([
  [SelectColumnFlowNode, 'SelectColumn'],
  [AssetSelectorFlowNode, 'AssetSelector'],
  [SelectColumnAlertFlowNode, 'ColumnDataAlert'],
])

export const TypeIdToCustomFlowNode = new Map<string, any>(
  Array.from(CustomFlowNodeTypeId.entries()).map((item) => item.reverse() as [string, any]),
)
