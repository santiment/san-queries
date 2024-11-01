import { mergeAttributes, Node, type RawCommands } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'tiptap-svelte-adapter'
import Component from './Component.svelte'
import { renderNodeViewUniversalHTML } from '../ssr'

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
  name: 'sanbase-chart',

  group: 'block global-parameter',

  draggable: true,
  selectable: false,

  addCommands() {
    return {
      addSanbaseChartWidget:
        () =>
        ({ editor, commands, dispatch, chain }) => {
          return chain()
            .focus()
            .insertContent({ type: 'sanbase-chart', attrs: { 'data-id': '' } })
            .run()
        },
    }
  },

  addAttributes() {
    return {
      'data-id': { default: '' },
      'data-asset-parameter': { default: '' },
      'data-from-parameter': { default: '' },
      'data-to-parameter': { default: '' },
      'data-metrics': { default: [] },
      style: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="sanbase-chart"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return renderNodeViewUniversalHTML(
      ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'sanbase-chart' })],
      this.options,
      Component,
    )
  },

  addNodeView() {
    return SvelteNodeViewRenderer(Component)
  },
})
