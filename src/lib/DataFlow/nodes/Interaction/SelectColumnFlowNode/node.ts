import { GenericFlowNode } from '../../GenericNode'

type Input = { column: { type: string } }
type Output = { column: { type: string } }
export class SelectColumnFlowNode extends GenericFlowNode<Input, Output> {
  type = 'Interaction'
  name = 'Select column'

  inputs = {
    column: { type: 'Any' },
  }
  outputs = {
    column: { type: 'Any' },
  }

  public process({ inputs }: { inputs: Partial<{ column: (null | string | number)[] }> }) {
    return {
      column: inputs.column ?? [],
    }
  }
}
