<script lang="ts">
  import type { ViewProps } from 'tiptap-svelte-adapter'

  type TProps = ViewProps & { onEnd?: (newHeight: string) => void }
  let { view, onEnd }: TProps = $props()

  function onPointerDown(e: PointerEvent) {
    const resizer = e.currentTarget as HTMLElement
    const parentNode = resizer.parentElement as HTMLElement

    const startHeight = parentNode.clientHeight
    const yStart = e.clientY

    resizer.setPointerCapture(e.pointerId)

    resizer.addEventListener('pointerup', onPointerUp, { once: true })
    resizer.addEventListener('pointermove', onPointerMove)

    function onPointerUp() {
      resizer.removeEventListener('pointermove', onPointerMove)
      resizer.releasePointerCapture(e.pointerId)

      const height = parentNode.clientHeight + 'px'

      view.$.updateAttributes({ style: 'height:' + height })

      onEnd?.(height)
    }

    function onPointerMove(eventMove: MouseEvent) {
      eventMove.preventDefault()
      eventMove.stopPropagation()

      const diff = Math.round(eventMove.clientY - yStart)
      const newHeight = Math.round(startHeight + diff)
      parentNode.style.height = newHeight + 'px'
    }
  }
</script>

<button
  aria-label="Resize widget"
  onpointerdown={onPointerDown}
  class="absolute z-10 size-5 cursor-se-resize"
></button>

<style>
  button {
    bottom: 0;
    right: 0;

    &:hover::after {
      opacity: 1;
      --black: var(--green-hover);
    }

    &::after {
      content: '';
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 5px;
      height: 5px;
      opacity: 0.5;
      border-right: 2px solid var(--black);
      border-bottom: 2px solid var(--black);
    }
  }
</style>
