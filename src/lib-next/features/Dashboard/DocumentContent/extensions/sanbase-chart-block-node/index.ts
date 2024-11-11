import { Node } from '@tiptap/core'
import { SANBASE_CHART_BLOCK_NODE } from './schema'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sanbaseChart: {
      /**
       * Add asset selector widget
       * @example editor.commands.addSanbaseChartWidget()
       */
      addSanbaseChartWidget: () => ReturnType
    }
  }
}

export default Node.create({
  ...SANBASE_CHART_BLOCK_NODE,

  group: 'block',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addSanbaseChartWidget:
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
  __schema: typeof SANBASE_CHART_BLOCK_NODE
}
