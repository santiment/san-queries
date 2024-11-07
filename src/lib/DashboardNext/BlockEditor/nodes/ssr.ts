import type { Component } from 'svelte'
import type { render as TRender } from 'svelte/server'
import type { VNode as TVNode } from 'zeed-dom'
import type { DOMOutputSpec } from '@tiptap/pm/model'

import { BROWSER } from 'esm-env'

const VNode = (BROWSER ? class {} : (await import('zeed-dom')).VNode) as typeof TVNode
const render = (BROWSER ? () => ({}) : (await import('svelte/server')).render) as typeof TRender

class SSRNode extends VNode {
  body = ''

  constructor(Component: Component, context: Map<string, any>, props: Record<string, any>) {
    super()

    const { body } = render(Component, {
      props,
      context,
    })

    this.body = body
  }

  get nodeType(): number {
    return 1
  }

  render(): string {
    return this.body
  }
}

/**
 * Used for rendering HTML for a custom svelte NodeView with a support for SSR
 */
export function renderNodeViewUniversalHTML(
  domSchema: [string, Record<string, any>],
  options: { ctx: Map<string, any> },
  // props: { node: Node; HTMLAttributes: Record<string, any> },
  Component: Component,
  node?: any,
): DOMOutputSpec {
  if (BROWSER) return domSchema

  const context = new Map(options.ctx)
  context.set('TiptapNodeViewCtx', {})

  const attrs = domSchema[1]
  if (!attrs.class) attrs.class = ''
  else attrs.class += ' '

  attrs.class += 'svelte-renderer'

  return [
    ...domSchema,
    new SSRNode(Component, context, {
      view: { $: { node: { attrs }, extension: { config: node } } },
    }),
  ]
}
