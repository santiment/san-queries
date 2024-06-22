import { BROWSER } from 'esm-env'
import { mergeAttributes, Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    hiddenBlock: {
      /**
       * Add Hidden Block at a current position
       * @example editor.commands.addHiddenBlock()
       */
      addHiddenBlock: () => ReturnType
    }
  }
}

export default Node.create({
  name: 'hidden-block',

  group: 'block',
  content: 'block+',

  draggable: true,
  // atom: true,

  addCommands() {
    return {
      addHiddenBlock:
        () =>
        ({ editor, commands, dispatch, chain }) => {
          return chain()
            .focus()
            .insertContent({ type: 'hidden-block', content: [{ type: 'paragraph' }] })
            .run()
        },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hidden-block"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    if (!BROWSER) {
      return ['div', {}]
    }

    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hidden-block' }), 0]
  },

  addNodeView() {
    if (this.editor.isEditable) return SvelteNodeViewRenderer(Component)

    // NOTE: Rendering nothing when document is in readonly(view) mode
    // https://github.com/ueberdosis/tiptap/discussions/2852#discussioncomment-2915596
    return () => {
      const dom = document.createTextNode('')
      // @ts-expect-error
      dom.hasAttribute = () => true

      return { dom }
    }
  },
})
