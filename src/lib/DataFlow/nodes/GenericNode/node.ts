import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  scan,
  shareReplay,
  tap,
} from 'rxjs'
import type { TCanvasNode } from '../../QueryWidgetFlowNode/node.svelte'
import type { Connection, Edge } from '@xyflow/svelte'

export abstract class GenericFlowNode<
  GInputs extends Record<string, { type: string }>,
  GOutputs extends Record<string, { type: string }>,
> {
  abstract type: string
  abstract name: string

  public node: TCanvasNode

  public state$ = of(null) as Observable<any> | BehaviorSubject<any>
  public inputs = {} as GInputs
  public outputs = {} as GOutputs

  OutputSubscribers: Map<string, Subscription['unsubscribe']> = new Map()

  public inputs$ = new BehaviorSubject({} as Partial<Record<string, unknown>>)
  public outputs$ = new BehaviorSubject({} as Partial<Record<string, unknown>>)
  process$: null | Observable<any> = null
  processed: null | Subscription = null

  constructor(node: TCanvasNode) {
    this.node = node
  }

  abstract process(data: { state: any; inputs: Partial<{ [K in keyof GInputs]: any }> }): Partial<{
    [K in keyof GOutputs]: unknown
  }>

  public onInit(data: { nodes: TCanvasNode[]; edges: Edge[] }): void
  public onInit() {
    const process$ = combineLatest({
      state: this.state$,
      inputs: this.inputs$.pipe(scan((acc, value) => Object.assign({}, acc, value), {})),
    }).pipe(
      map((data) => this.process(data)),
      shareReplay(1),
    )

    this.process$ = process$
    this.processed = process$.subscribe((processed) => this.outputs$.next(processed))
  }

  public onNewOutputConnection(targetNode: TCanvasNode, connection: Connection) {
    const targetInputs$ = targetNode.data.instance.inputs$
    const outputId = connection.sourceHandle!
    const inputId = connection.targetHandle!

    const sendData = (value: any) => targetInputs$.next(value)
    const subscription = this.outputs$
      .pipe(
        distinctUntilChanged(),
        map((outputs) => ({ [inputId]: outputs[outputId] })),
      )
      .subscribe(sendData)

    this.OutputSubscribers.set(getConnectionId(connection), () => {
      subscription.unsubscribe()
      sendData({ [inputId]: null })
    })
  }

  public onDeletedOutputConnection(
    edge: Edge,
    data: { nodes: TCanvasNode[]; edges: Edge[] },
    targetNode: TCanvasNode,
  ) {
    const unsubscribe = this.OutputSubscribers.get(getConnectionId(edge))
    unsubscribe?.()
  }

  public destroy() {
    this.processed?.unsubscribe()

    // TODO: Complete process$ on destroy
    // this.process$.complete()
    this.inputs$.complete()
    this.outputs$.complete()

    Array.from(this.OutputSubscribers.values()).forEach((subscriber) => subscriber())
  }
}

export function getConnectionId({ source, target, sourceHandle, targetHandle }: Connection | Edge) {
  return `${source}+${sourceHandle}-${target}+${targetHandle}`
}
