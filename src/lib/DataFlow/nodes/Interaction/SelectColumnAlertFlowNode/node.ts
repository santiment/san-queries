import type { Connection, Edge, Node } from '@xyflow/svelte'
import { BehaviorSubject, map, shareReplay } from 'rxjs'
import { GenericFlowNode } from '../../GenericNode'

type Alert = {
  type: 'asset' | 'address' | 'watchlist' | 'screener'
}

// type Input = { slug: { type: string } }
// type Output = { slug: { type: string } }
export class SelectColumnAlertFlowNode extends GenericFlowNode<any, any> {
  type = 'Column data to alert'
  name = 'Column data to alert'

  _state: BehaviorSubject<Alert>
  state$: BehaviorSubject<Alert>

  public Component = () => import('./index.svelte')

  constructor(node: Node, ctx: any) {
    super(node)

    const alert = ctx.data || { type: 'asset' }
    this._state = new BehaviorSubject(alert)
    this.state$ = this._state
  }

  public process() {
    return {}
  }

  public getWidgetValue() {
    const state = this._state.getValue()
    return { type: state.type }
  }
}
