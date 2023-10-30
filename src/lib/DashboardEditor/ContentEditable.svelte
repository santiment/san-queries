<script lang="ts">
  import { noop } from 'san-webkit/lib/utils'

  let className = ''
  export { className as class }

  export let as = 'p'
  export let placeholder = 'Add your text here...'
  export let onChange = noop
  export let value = ''

  function onBlur(e: Event) {
    const node = e.currentTarget as HTMLElement
    const text = (node.textContent || '').trim()
    node.innerText = text

    onChange(text)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') e.preventDefault()
  }

  function onInput(e: Event) {
    const node = e.currentTarget as HTMLElement

    const text = (node.textContent || '').trim()
    onChange(text)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={as}
  class="{className} relative"
  contenteditable="true"
  {placeholder}
  on:blur={onBlur}
  on:input={onInput}
  on:keydown={onKeyDown}
  on:keyup
>
  {value}
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
