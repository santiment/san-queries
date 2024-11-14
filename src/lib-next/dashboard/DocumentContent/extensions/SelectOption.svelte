<script lang="ts" generics="GOption">
  import type { Snippet } from 'svelte'

  type TProps = {
    title: string
    name: string
    value: undefined | null | number | string
    onChange: (value: string, node: HTMLSelectElement) => void
    options: GOption[]
    children: Snippet<[{ option: GOption; i: number }]>
  }
  let { title, name, value, options, children, onChange }: TProps = $props()

  function onchange(e: Event) {
    const node = e.currentTarget as HTMLSelectElement

    onChange(node.value, node)
  }
</script>

<div class="flex">
  {title}:

  <select {name} class="flex-1" {onchange} {value}>
    <option value="">--Choose {title}--</option>
    {#each options as option, i}
      {@render children({ option, i })}
    {/each}
  </select>
</div>
