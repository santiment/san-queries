import { Node } from '@tiptap/core'
import { DATE_CALENDAR_FIELD_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dateCalendarField: {
      /**
       * Add asset selector widget
       * @example editor.commands.addDateCalendarFieldWidget()
       */
      addDateCalendarFieldWidget: () => ReturnType
    }
  }
}

export default Node.create({
  ...DATE_CALENDAR_FIELD_NODE,

  priority: 101,

  group: 'inline global-parameter',

  inline: true,

  selectable: false,

  atom: true,

  addCommands() {
    return {
      addDateCalendarFieldWidget:
        (value?: string) =>
        ({ chain }) => {
          const id = ''
          return chain()
            .focus()
            .insertContent({ type: this.name, attrs: { 'data-id': id, value: value } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      value: { default: '' },

      style: { default: '' },
      class: { default: 'inline-flex align-middle' },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
}) as Node & { __schema: typeof DATE_CALENDAR_FIELD_NODE }
