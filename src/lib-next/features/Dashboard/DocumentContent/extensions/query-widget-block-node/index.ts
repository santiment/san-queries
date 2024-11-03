import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'

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
  name: 'query-widget',
  isDataWidget: true,

  group: 'block',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addQueryWidget:
        (id: string) =>
        ({ editor, commands, dispatch, chain }) => {
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
      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': this.name })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
