import { GenericFlowNode } from '../GenericNode'
import type { TCanvasNode } from '../QueryWidgetFlowNode/node.svelte'

type Input = { value: { type: string } }
type Output = { value: { type: string } }
export class GlobalParameterFlowNode extends GenericFlowNode<Input, Output> {
  type = 'Global Parameter'
  name = ''

  public parameter: {}

  public Component = () => import('./index.svelte')

  constructor(node: TCanvasNode, parameter: any) {
    super(node)
    this.parameter = parameter
  }

  public process({
    inputs,
  }: {
    inputs: Partial<{ value: null | number | string | number[] | string[] | null[] }>
  }) {
    return {
      value: inputs.value || this.parameter.value,
    }
  }
}
