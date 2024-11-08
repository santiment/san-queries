import { Node } from '@tiptap/core'
import { CONTROLLED_LIST_BLOCK_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    controlledList: {
      /**
       * Add query block
       * @example editor.commands.addControlledListWidget()
       */
      addControlledListWidget: () => ReturnType
    }
  }
}

export default Node.create({
  ...CONTROLLED_LIST_BLOCK_NODE,

  group: 'block global-parameter',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addControlledListWidget:
        () =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({ type: this.name, attrs: { 'data-id': '' } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      value: { default: '' },

      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
}) as Node & { __schema: typeof CONTROLLED_LIST_BLOCK_NODE }
