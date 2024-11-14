import { Node } from '@tiptap/core'
import { ASSET_SELECTOR_NODE } from './schema'

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
  ...ASSET_SELECTOR_NODE,

  priority: 101,

  group: 'inline global-parameter',

  inline: true,

  selectable: false,

  atom: true,

  addCommands() {
    return {
      addAssetSelectorWidget:
        (slug?: string) =>
        ({ chain }) => {
          let id = ''
          return chain()
            .focus()
            .insertContent({ type: this.name, attrs: { 'data-id': id, 'data-value': slug } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      value: { default: '' },
      slug: { default: '' },

      style: { default: '' },
      class: { default: 'inline-flex align-middle' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
}) as Node & { __schema: typeof ASSET_SELECTOR_NODE }
