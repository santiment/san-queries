import { BehaviorSubject, distinctUntilChanged, scan, share, shareReplay, tap } from 'rxjs'
import { GenericFlowNode, type TInputs } from '../GenericNode/node'
import { getOutgoers, type Connection, type Edge, type Node } from '@xyflow/svelte'
import { SelectColumnFlowNode } from '../Interaction/SelectColumnFlowNode'
import { SelectColumnAlertFlowNode } from '../Interaction/SelectColumnAlertFlowNode'

type TNodeInput = {}
export type TCanvasNode = Node & { data: { instance: QueryWidgetFlowNode } }

type TState = Partial<{
  isSelectable: boolean
  selections: any[][]
  alert$: null | BehaviorSubject<{ type: any }>
}>
export class QueryWidgetFlowNode extends GenericFlowNode<any, any> {
  type = 'Query Widget'
  name = 'Untitled'

  _state = new BehaviorSubject<TState>({})
  state$ = this._state.pipe(
    scan((state, value) => Object.assign({}, state, value), {
      isSelectable: false,
      selections: [],
      alert$: null,
    }),

    distinctUntilChanged(
      (prev, current) =>
        prev.isSelectable === current.isSelectable &&
        prev.selections === current.selections &&
        prev.alert$ === current.alert$,
    ),
    shareReplay(1),
  )
  inputs = $state.frozen({})
  outputs = $state.frozen({})

  Component = () => import('./index.svelte')

  constructor(
    node: TCanvasNode,
    {
      name = 'Untitled',
      inputs = {},
      outputs = {},
    }: Partial<{
      name: string
      inputs: Record<string, unknown>
      outputs: Record<string, unknown>
    }> = {},
  ) {
    super(node)

    this.name = name
  }

  setInputs(parameters: { key: string; type: any }[]) {
    // TODO: Clear subs and form new connection?

    this.inputs = parameters.reduce((acc, parameter) => {
      return Object.assign(acc, { [parameter.key]: parameter })
    }, {} as TNodeInput)
  }

  setOutputs(sqlData?: null | App.SqlData) {
    if (!sqlData) return

    // TODO: Clear subs and form new connection?

    this.outputs = sqlData.columns.reduce((acc, columnKey: string, i: number) => {
      return Object.assign(acc, { [columnKey]: { type: sqlData.columnTypes[i] } })
    }, {} as TNodeInput)
  }

  public process({ state }: { state: Partial<{ selections: any[][] }> }) {
    const { selections } = state

    return Object.keys(this.outputs).reduce(
      (acc, column, i) =>
        Object.assign(acc, {
          [column]: selections?.map((row) => row[i]),
        }),
      {},
    )
  }

  public onNewOutputConnection(targetNode: Node, connection: Connection) {
    if (checkIsSelectColumnNode(targetNode)) {
      this._state.next({ isSelectable: true })
    } else if (checkIsAlertNode(targetNode)) {
      this._state.next({ alert$: targetNode.data.instance.state$ })
    }

    super.onNewOutputConnection(targetNode, connection)
  }

  public onDeletedOutputConnection(
    edge: Edge,
    data: { nodes: TCanvasNode[]; edges: Edge[] },
    targetNode: TCanvasNode,
  ) {
    super.onDeletedOutputConnection(edge, data, targetNode)
    const { nodes, edges } = data

    this._state.next({
      isSelectable: getOutgoers(this.node, nodes, edges).some(checkIsSelectColumnNode),
    })

    if (checkIsAlertNode(targetNode)) {
      this._state.next({ alert$: null })
    }
  }
}

const checkIsSelectColumnNode = (node: Node) => node.data.instance instanceof SelectColumnFlowNode
const checkIsAlertNode = (node: Node) => node.data.instance instanceof SelectColumnAlertFlowNode
