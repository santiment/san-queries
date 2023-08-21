<script lang="ts">
  let className = ''
  export { className as class }

  export let as = 'p'
  export let placeholder = 'Add your text here...'

  function onBlur(e: Event) {
    const node = e.currentTarget as HTMLElement
    const text = (node.textContent || '').trim()
    node.innerText = text
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') e.preventDefault()
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={as}
  class="{className} relative"
  contenteditable="true"
  {placeholder}
  on:blur={onBlur}
  on:input
  on:keydown={onKeyDown}
  on:keyup
  on:input
>
  <slot />
</svelte:element>

<style lang="scss">
  [contenteditable] {
    outline: none;

    &:empty::before {
      content: attr(placeholder);
      display: block;
      color: var(--waterloo);
      pointer-events: none;
      position: absolute;
    }
  }
</style>
