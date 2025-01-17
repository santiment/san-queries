import { Node } from '@tiptap/core'
import { ASSET_INFO_BLOCK_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    assetInfo: {
      /**
       * Add asset selector widget
       * @example editor.commands.addSanbaseChartWidget()
       */
      addAssetInfoWidget: () => ReturnType
    }
  }
}

export default Node.create({
  ...ASSET_INFO_BLOCK_NODE,

  group: 'block',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addAssetInfoWidget:
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
      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
}) as Node<any, any> & {
  __schema: typeof ASSET_INFO_BLOCK_NODE
}
