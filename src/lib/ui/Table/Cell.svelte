<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children, class: className }: { children: Snippet; class?: string } = $props()
</script>

<td class={className}>
  {@render children()}
</td>
