import { AssetSelectorFlowNode } from './AssetSelector'
import { SelectColumnFlowNode } from './Interaction/SelectColumnFlowNode'

export const LAYOUT_FlOW_NODES = new Set([AssetSelectorFlowNode])

export const FlOW_WIDGET_NODES = new Set([SelectColumnFlowNode])

// DO NOT CHANGE ORDER
export const CustomFlowNodeTypeId = new Map<any, string>([
  [SelectColumnFlowNode, 'SelectColumn'],
  [AssetSelectorFlowNode, 'AssetSelector'],
])

export const TypeIdToCustomFlowNode = new Map<string, any>(
  Array.from(CustomFlowNodeTypeId.entries()).map((item) => item.reverse() as [string, any]),
)
