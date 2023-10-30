<script lang="ts">
  export let title: string
  export let isRenaming = false
  export let onRename: (value: string) => void

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        return (e.currentTarget as HTMLInputElement).blur()
    }
  }

  function onFocus(node: HTMLElement) {
    const selection = window.getSelection()
    if (!selection) return

    const range = document.createRange()
    selection.removeAllRanges()
    range.selectNodeContents(node)
    selection.addRange(range)
  }

  function onBlur(e: Event) {
    isRenaming = false
    const titleNode = e.currentTarget as HTMLElement
    const _title = (titleNode.textContent as string).trim()

    if (title === _title) return

    onRename((title = _title))
  }
</script>

{#if isRenaming}
  <!-- svelte-ignore a11y-autofocus -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span contenteditable="true" on:keydown={onKeyDown} on:blur={onBlur} use:onFocus autofocus={true}>
    {title}
  </span>
{:else}
  {title}
{/if}

<style>
  span {
    outline-offset: 3px;
  }
</style>
