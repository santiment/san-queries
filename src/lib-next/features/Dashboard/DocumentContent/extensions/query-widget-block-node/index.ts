import { Node } from '@tiptap/core'
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
}) as Node<any, any> & {
  __schema: typeof QUERY_WIDGET_BLOCK_NODE
}
