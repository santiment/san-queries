import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    queryTextColumn: {
      /**
       * Add Query Text Column Block at the current cursor position
       * @example editor.commands.addQueryTextColumn()
       */
      addQueryTextColumn: (dashboardQueryMappingId: string, column: string) => ReturnType
    }
  }
}

export default Node.create({
  name: 'query-text-column',

  group: 'block',

  draggable: true,

  addCommands() {
    return {
      addQueryTextColumn:
        () =>
        ({ editor, commands, dispatch, chain }) => {
          return chain().focus().insertContent({ type: 'query-text-column', attrs: {} }).run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-link-query': { default: '' },
      'data-link-column': { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="query-text-column"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'query-text-column' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
