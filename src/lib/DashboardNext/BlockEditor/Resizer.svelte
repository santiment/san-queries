<script lang="ts">
  let { onEnd }: { onEnd: (newHeight: string) => void } = $props()

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

      onEnd(parentNode.style.height)
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

<button onpointerdown={onPointerDown}></button>

<style>
  button {
    cursor: se-resize;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;

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
