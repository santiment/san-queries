import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

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
  name: 'controlled-list',

  group: 'block global-parameter',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addControlledListWidget:
        () =>
        ({ editor, commands, dispatch, chain }) => {
          return chain()
            .focus()
            .insertContent({ type: 'controlled-list', attrs: { 'data-id': '' } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-value': { default: [] },
      'data-link-query': { default: '' },
      'data-link-column': { default: '' },
      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="controlled-list"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'controlled-list' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
