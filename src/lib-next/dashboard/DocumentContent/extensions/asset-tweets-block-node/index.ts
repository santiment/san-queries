import { Node } from '@tiptap/core'
import { ASSET_TWEETS_BLOCK_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    assetTweets: {
      /**
       * Add asset selector widget
       * @example editor.commands.addSanbaseChartWidget()
       */
      addAssetTweetsWidget: () => ReturnType
    }
  }
}

export default Node.create({
  ...ASSET_TWEETS_BLOCK_NODE,

  group: 'block',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addAssetTweetsWidget:
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
  __schema: typeof ASSET_TWEETS_BLOCK_NODE
}
