import type { Connection, Edge, Node } from '@xyflow/svelte'
import { BehaviorSubject, map, shareReplay } from 'rxjs'
import { GenericFlowNode } from '../../GenericNode'

type Alert = {
  type: 'asset' | 'address' | 'watchlist' | 'screener'
}

type Input = { column: any }
// type Output = { slug: { type: string } }
export class SelectColumnAlertFlowNode extends GenericFlowNode<Input, any> {
  type = 'Column data to alert'
  name = 'Column data to alert'

  _state: BehaviorSubject<Alert>
  state$: BehaviorSubject<Alert>

  public Component = () => import('./index.svelte')

  inputs = {
    column: { type: 'Any' },
  }

  constructor(node: Node, ctx: any) {
    super(node)

    const alert = ctx.data || { type: 'metric_signal' }
    this._state = new BehaviorSubject(alert)
    this.state$ = this._state
  }

  public process({ state, inputs }) {
    if (state.type === 'metric_signal') {
      return { slug: Array.from(new Set(inputs?.column || [])) }
    }

    if (state.type === 'wallet_movement') {
      return { address: Array.from(new Set(inputs?.column || [])) }
    }
  }

  public getWidgetValue() {
    const state = this._state.getValue()
    return { type: state.type }
  }
}
