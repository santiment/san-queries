import { renderNodeViewUniversalHTML } from '$lib/DashboardNext/BlockEditor/nodes/ssr'
import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
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
    return [{ tag: `span[data-type="${this.name}"]` }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['span', mergeAttributes(HTMLAttributes, { 'data-type': this.name })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
