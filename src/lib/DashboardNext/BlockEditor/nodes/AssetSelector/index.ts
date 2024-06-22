import { mergeAttributes, Node, type RawCommands } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

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
  name: 'asset-selector',

  group: 'inline global-parameter',

  inline: true,
  selectable: false,
  draggable: true,

  addCommands() {
    return {
      addAssetSelectorWidget:
        (slug?: string) =>
        ({ editor, commands, dispatch, chain }) => {
          let id = ''
          return chain()
            .focus()
            .insertContent({ type: 'asset-selector', attrs: { 'data-id': id, 'data-value': slug } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-value': { default: 'bitcoin' },
      style: { default: '' },
      class: { default: 'inline-flex align-middle' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="asset-selector"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'asset-selector' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
