import tippy from 'tippy.js'
import { SvelteRenderer } from 'tiptap-svelte-adapter'
import { COMMANDS } from './suggestions'
import CommandList from './CommandList.svelte'

export default {
  items: ({ query }: { query: string }) => {
    return COMMANDS.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase()),
    ).slice(0, 10)
  },

  render: () => {
    let target: HTMLElement
    let renderer: SvelteRenderer
    let popup: ReturnType<typeof tippy>

    return {
      onStart: (props) => {
        target = document.createElement('div')

        renderer = new SvelteRenderer(CommandList, {
          props,
          target,
        })

        if (!props.clientRect) {
          return
        }

        document.body.appendChild(target)

        popup = tippy('body', {
          zIndex: 100,
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: target,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        renderer.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return renderer.component.onKeyDown(props.event)
      },

      onExit() {
        popup[0].destroy()
        renderer.destroy()
        target?.remove()
      },
    }
  },
}
