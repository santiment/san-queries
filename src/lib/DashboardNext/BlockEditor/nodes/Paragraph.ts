import { mergeAttributes } from '@tiptap/core'
import { Paragraph } from '@tiptap/extension-paragraph'

export default Paragraph.extend({
  parseHTML() {
    return [{ tag: 'div[data-type="paragraph"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'paragraph' }), 0]
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-l': () => this.editor.commands.toggleBulletList(),
  //   }
  // },
})
