<script lang="ts" context="module">
  import { SvelteSet as Set } from 'svelte/reactivity'
  import { createCtx } from '$lib/ctx'

  export const useSelectedRowsCtx = createCtx('useSelectedRowsCtx', () => {
    const selections = new Set<any>()

    return { selections }
  })
</script>

<script lang="ts">
  import Checkbox from '$lib/ui/Checkbox'
  import { untrack } from 'svelte'

  let { row }: { row: any } = $props()

  const { selections } = useSelectedRowsCtx()

  const onChange = (next: boolean) =>
    untrack(() => {
      next ? selections.add(row) : selections.delete(row)
    })
</script>

<div class="flex items-center">
  <Checkbox {onChange}></Checkbox>
</div>
