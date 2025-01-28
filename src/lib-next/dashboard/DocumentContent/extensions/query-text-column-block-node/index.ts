import { Node } from '@tiptap/core'
import { QUERY_TEXT_COLUMN_BLOCK_NODE } from './schema'

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
  ...QUERY_TEXT_COLUMN_BLOCK_NODE,

  group: 'block',

  //draggable: false,
  selectable: true,

  addCommands() {
    return {
      addQueryTextColumn:
        () =>
          ({ chain }) => {
            return chain().focus().insertContent({ type: this.name, attrs: {} }).run()
          },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-link-query': { default: '' },
      'data-link-column': { default: '' },
      // linkedQuery: {
      //   default: '',
      //   parseHTML: (node) => node.getAttribute('data-link-query'),
      //   renderHTML: (attributes) => ({
      //     'data-link-query': attributes.linkedQuery,
      //   }),
      // },
      // linkedColumn: {
      //   default: '',
      //   parseHTML: (node) => node.getAttribute('data-link-column'),
      //   renderHTML: (attributes) => ({
      //     'data-link-column': attributes.linkedColumn,
      //   }),
      // },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },

  //renderHTML({ HTMLAttributes }) {
  //  return renderNodeViewUniversalHTML(
  //    ['div', mergeAttributes(HTMLAttributes, { 'data-type': this.name })],
  //    this.options,
  //    Component,
  //  )
  //},

  //addNodeView() {
  //  return SvelteNodeViewRenderer(Component)
  //},
})
