<script lang="ts">
  let {
    tag = 'div',
    readonly = false,
    value = '',
    class: className = '',
    placeholder = 'Input text here',
    onBlur,
  }: {
    tag: string
    value: App.Empty<string>

    readonly?: boolean
    placeholder?: string
    class?: string
    onBlur?: (value: string) => void
  } = $props()

  function onblur(e: Event) {
    const node = e.currentTarget as HTMLElement
    const text = (node.textContent || '').trim()
    node.innerText = text

    onBlur?.(text)
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') e.preventDefault()
  }
</script>

{#if !readonly || value}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <svelte:element
    this={tag}
    class="{className} relative"
    contenteditable={readonly ? 'false' : 'true'}
    {placeholder}
    on:blur={onblur}
    on:keydown={onkeydown}
  >
    {value}
  </svelte:element>
{/if}

<style lang="postcss">
  [contenteditable] {
    outline: none;

    &:empty::before {
      content: attr(placeholder);
      display: block;
      color: var(--waterloo);
      pointer-events: none;
      position: absolute;
      top: 0;
    }
  }
</style>
