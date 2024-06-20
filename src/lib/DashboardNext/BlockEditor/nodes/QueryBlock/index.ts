import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    queryWidget: {
      /**
       * Toggle a paragraph
       * @example editor.commands.toggleParagraph()
       */
      addQueryWidget: (dashboardQueryMappingId: string) => ReturnType
    }
  }
}

export default Node.create({
  name: 'query-widget',

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
            .insertContent({ type: 'query-widget', attrs: { 'data-id': id } })
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
    return [{ tag: 'div[data-type="query-widget"]' }]
  },

  renderHTML({ HTMLAttributes, ...rest }) {
    return renderNodeViewUniversalHTML(
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'query-widget' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
