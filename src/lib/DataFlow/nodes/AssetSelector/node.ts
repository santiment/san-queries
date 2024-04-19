import type { Connection, Edge, Node } from '@xyflow/svelte'
import { BehaviorSubject, map, shareReplay } from 'rxjs'
import { GenericFlowNode } from '../GenericNode'

type Asset = { slug: string; name?: string; ticker?: string }

type Input = { slug: { type: string } }
type Output = { slug: { type: string } }
export class AssetSelectorFlowNode extends GenericFlowNode<Input, Output> {
  type = 'Asset selector'
  name = 'Asset selector'

  outputs = {
    slug: { type: 'Any' },
  }

  _state: BehaviorSubject<Asset>
  state$: BehaviorSubject<Asset>

  public Component = () => import('./index.svelte')

  public widget: any

  constructor(node: Node, ctx: any) {
    super(node)

    const asset = ctx.data || { slug: 'uniswap' }
    this._state = new BehaviorSubject(asset)
    this.state$ = this._state

    if (ctx.noWidgetAdd !== true) {
      const widget = ctx.widgetsCtx.addWidget('ASSET_SELECTOR', {
        id: node.id,
        data: asset,
        flowNode: this,
      })
      ctx.layoutCtx.addItem(widget)

      this.widget = widget
    }
  }

  public process({ state }: { state: Asset }) {
    return { slug: state.slug }
  }

  public getWidgetValue() {
    const state = this._state.getValue()
    return { slug: state.slug }
  }
}
