import { BROWSER } from 'esm-env'
import { Node } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './ui/index.svelte'

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

  isolating: true,

  addCommands() {
    return {
      addHiddenBlock:
        () =>
        ({ chain }) => {
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

  renderHTML() {
    if (!BROWSER) {
      return ['div', {}]
    }

    return ['div', { 'data-type': 'hidden-block' }, 0]
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
    // NOTE: Hidden block should still be rendered to trigger component hooks

    /*
    if (this.editor.isEditable) return SvelteNodeViewRenderer(Component)

    // NOTE: Rendering nothing when document is in readonly(view) mode
    // https://github.com/ueberdosis/tiptap/discussions/2852#discussioncomment-2915596
    return () => {
      const dom = document.createTextNode('')
      // @ts-expect-error
      dom.hasAttribute = () => true

      return { dom }
    }
      */
  },
})
