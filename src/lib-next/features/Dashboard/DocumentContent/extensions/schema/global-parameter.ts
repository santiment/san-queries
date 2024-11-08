import type { Component } from 'svelte'
import type { TDashboardGlobalParameterKey } from '$lib-next/features/Dashboard/types'

import { BROWSER } from 'esm-env'
import { SvelteNodeViewRenderer, type ViewProps } from 'tiptap-svelte-adapter'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'
import {
  useDashboardGlobalParametersCtx,
  type TDashboardGlobalParameter,
} from '$lib-next/features/Dashboard/ctx/global-parameters.svelte'
import GenericNodeView from '../GenericNodeView.svelte'

export type TGlobalParametersWidgetProps<
  GGlobalParameterWidget extends TGlobalParameterNode = TGlobalParameterNode,
> = {
  view: ViewProps['view']
  data: {
    id: TDashboardGlobalParameterKey
    widget: TDashboardGlobalParameter<GGlobalParameterWidget>
  }
}

export type TGlobalParameterWidgetComponent = Component<TGlobalParametersWidgetProps>
export type TNodeViewInitResult = Partial<TGlobalParametersWidgetProps['data']>

type TGlobalParameterSchema = {
  name: string
  keyPrefix: string

  rootTag?: string

  class?: string
  Component: TGlobalParameterWidgetComponent

  /** Will be uploaded to API */
  initOutputs(defaultOutputValues?: Partial<{ [key: string]: unknown }>): { [key: string]: unknown }

  /** Will be uploaded to API */
  initSettings?: (defaultSettings?: Partial<{ [key: string]: unknown }>) => {
    [key: string]: unknown
  }

  initNodeView?: (view: ViewProps['view']) => TNodeViewInitResult | Promise<TNodeViewInitResult>
}

// export type TGlobalParameterNode = ReturnType<typeof createGlobalParameterSchema>
export type TGlobalParameterNode<GSchema extends TGlobalParameterSchema = any> = {
  isGlobalParameter: true

  name: GSchema['name']
  keyPrefix: GSchema['keyPrefix']

  class?: GSchema['class']
  Component: TGlobalParameterWidgetComponent

  initOutputs: GSchema['initOutputs']
  initSettings: GSchema['initSettings']

  initNodeView: (view: ViewProps['view']) => TNodeViewInitResult | Promise<TNodeViewInitResult>

  addNodeView: () => ReturnType<typeof SvelteNodeViewRenderer>
  renderHTML(this: any, props: { HTMLAttributes: any }): any
}

export function createGlobalParameterSchema<GSchema extends TGlobalParameterSchema>(
  schema: GSchema,
): TGlobalParameterNode<GSchema> {
  const node = {
    isGlobalParameter: true,

    name: schema.name as GSchema['name'],
    keyPrefix: schema.keyPrefix as GSchema['keyPrefix'],

    class: schema.class as GSchema['class'],
    Component: schema.Component,

    initOutputs: schema.initOutputs as GSchema['initOutputs'],
    initSettings: schema.initSettings as GSchema['initSettings'],

    initNodeView(view: ViewProps['view']): TNodeViewInitResult | Promise<TNodeViewInitResult> {
      const { attrs } = view.$.node
      const { 'data-id': id } = attrs

      const { getGlobalParameter, registerGlobalParameter } = useDashboardGlobalParametersCtx.get()

      const data: TNodeViewInitResult = { id, widget: getGlobalParameter(id) }

      if (!BROWSER) {
        return data
      }

      if (!data.widget) {
        const widget = registerGlobalParameter(data.id, node)

        data.id = widget.id
        data.widget = widget as any
      }

      return schema.initNodeView?.(data as any) || data
    },

    addNodeView() {
      return SvelteNodeViewRenderer(GenericNodeView)
    },

    renderHTML(this: any, { HTMLAttributes }: any) {
      return renderNodeViewUniversalHTML(
        [
          schema.rootTag || 'div',
          {
            'data-type': this.name,
            'data-id': HTMLAttributes['data-id'],
            class: HTMLAttributes['class'],
            style: HTMLAttributes['style'],
          },
        ],
        this.options,
        GenericNodeView as any,
        node,
      )
    },
  } as const

  return node
}
