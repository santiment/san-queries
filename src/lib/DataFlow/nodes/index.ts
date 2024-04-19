import { AssetSelectorFlowNode } from './AssetSelector'
import { SelectColumnFlowNode } from './Interaction/SelectColumnFlowNode'

export const LAYOUT_FlOW_NODES = new Set([AssetSelectorFlowNode])

export const FlOW_WIDGET_NODES = new Set([SelectColumnFlowNode])

// DO NOT CHANGE ORDER
export const CustomFlowNodeTypeId = [
  SelectColumnFlowNode, // 0
  AssetSelectorFlowNode, // 1
]
