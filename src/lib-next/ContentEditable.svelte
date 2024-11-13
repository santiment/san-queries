<script lang="ts">
  import { cn } from '$lib/ui/utils'

  type TProps = {
    as: 'div' | 'h1' | 'h2' | 'p'
    class?: string
    placeholder?: string
    readonly?: boolean
    defaultValue?: string
    onBlur?: (value: string) => void
  }
  let {
    class: className,
    as = 'div',
    readonly = false,
    placeholder = 'Input text here',
    defaultValue = '',
    onBlur,
  }: TProps = $props()

  const _defaultValue = defaultValue

  function onblur(e: Event) {
    const node = e.currentTarget as HTMLElement
    const text = (node.textContent || '').trim()

    node.innerText = text

    onBlur?.(text)
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      return (e.currentTarget as HTMLElement).blur()
    }
  }
</script>

<svelte:element
  this={as}
  class={cn('relative outline-none', className)}
  role={readonly ? undefined : 'textbox'}
  contenteditable={readonly ? 'false' : 'true'}
  aria-placeholder={readonly ? undefined : placeholder}
  {onkeydown}
  onblur={readonly ? undefined : onblur}
>
  {_defaultValue}
</svelte:element>

<style>
  .relative:empty::before {
    content: attr(aria-placeholder);
    display: block;
    color: var(--waterloo);
    pointer-events: none;
    position: absolute;
    top: 0;
  }
</style>
