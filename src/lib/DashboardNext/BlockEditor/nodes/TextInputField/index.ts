import { mergeAttributes, Node, type RawCommands } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inputField: {
      /**
       * Add asset selector widget
       * @example editor.commands.addInputFieldWidget("bitcoin")
       */
      addInputFieldWidget: (slug?: string) => ReturnType
    }
  }
}

export default Node.create({
  name: 'text-input-field',

  group: 'inline global-parameter',

  inline: true,
  selectable: false,
  // draggable: false,

  addCommands() {
    return {
      addInputFieldWidget:
        (slug?: string) =>
        ({ editor, commands, dispatch, chain }) => {
          let id = ''
          return chain()
            .focus()
            .insertContent({
              type: 'text-input-field',
              attrs: { 'data-id': id, 'data-value': slug },
            })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-value': { default: '' },
      style: { default: '' },
      class: { default: 'inline-flex align-middle' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="text-input-field"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'text-input-field' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
