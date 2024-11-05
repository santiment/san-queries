import { Node } from '@tiptap/core'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'
import { QUERY_WIDGET_BLOCK_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    queryWidget: {
      /**
       * Add query block
       * @example editor.commands.addQueryWidget("")
       */
      addQueryWidget: (dashboardQueryMappingId: string) => ReturnType
    }
  }
}

export default Node.create({
  ...QUERY_WIDGET_BLOCK_NODE,

  group: 'block',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addQueryWidget:
        (id: string) =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({ type: this.name, attrs: { 'data-id': id } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      queryId: { default: '' },
      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['div', { 'data-type': this.name, 'data-id': HTMLAttributes['data-id'] }],
      this.options,
      Component,
    )
  },

  // addNodeView() {
  //   return SvelteNodeViewRenderer(Component)
  // },
})
