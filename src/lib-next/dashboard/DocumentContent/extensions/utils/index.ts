import type { ViewProps } from 'tiptap-svelte-adapter'

export { useDeepChangeEffect } from './settings.svelte'

export function triggerEmptyUpdate(view: ViewProps['view']) {
  const pos = view.$.getPos()
  view.$.editor
    .chain()
    .command(({ tr }) => {
      tr.setMeta('addToHistory', false)
      tr.setNodeAttribute(pos, '', undefined)
      return true
    })
    .focus(pos)
    .run()
}
