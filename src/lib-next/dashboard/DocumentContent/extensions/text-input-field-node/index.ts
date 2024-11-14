import { Node } from '@tiptap/core'
import { TEXT_INPUT_FIELD_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    assetSelector: {
      /**
       * Add asset selector widget
       * @example editor.commands.addAssetSelectorWidget("bitcoin")
       */
      addAssetSelectorWidget: (slug?: string) => ReturnType
    }
  }
}

export default Node.create({
  ...TEXT_INPUT_FIELD_NODE,

  priority: 101,

  group: 'inline global-parameter',

  inline: true,

  selectable: false,

  atom: true,

  addCommands() {
    return {
      addInputFieldWidget:
        (value?: string) =>
        ({ chain }) => {
          const id = ''
          return chain()
            .focus()
            .insertContent({
              type: 'text-input-field',
              attrs: { 'data-id': id, value: value },
            })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      value: { default: '' },

      style: { default: '' },
      class: { default: 'inline-flex align-middle' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
}) as Node & { __schema: typeof TEXT_INPUT_FIELD_NODE }
