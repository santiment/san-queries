<script lang="ts">
  import type { SS } from 'svelte-runes'

  let { view }: { view: SS<{ items: any[]; command: (props: any) => void }> } = $props()
  let items = $derived(view.$.items)
  let command = $derived(view.$.command)

  let selectedIndex = $state(0)

  $effect(() => {
    selectedIndex = items && 0
  })

  export function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      selectedIndex = (selectedIndex + items.length - 1) % items.length
      return true
    }

    if (event.key === 'ArrowDown') {
      selectedIndex = (selectedIndex + 1) % items.length
      return true
    }

    if (event.key === 'Enter') {
      selectItem(selectedIndex)
      return true
    }

    return false
  }

  function selectItem(index: number) {
    const item = items[index]

    if (item) command(item)
  }
</script>

<div
  class="absolute max-h-[400px] min-w-[170px] items-start overflow-auto border bg-white p-2 shadow column"
>
  {#each items as item, index}
    <button
      class="flex w-full rounded px-1.5 py-0.5 text-left hover:bg-porcelain"
      class:bg-porcelain={index === selectedIndex}
      onclick={() => selectItem(index)}
    >
      {item.title}
    </button>
  {:else}
    <div class="item">No result</div>
  {/each}
</div>
