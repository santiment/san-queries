<script lang="ts" context="module">
  const CTX = 'useSelectedRows'

  export function useSelectedRows() {
    const selections = new Set<any>()

    return setContext(CTX, { selections })
  }

  useSelectedRows.getCtx = () => getContext(CTX) as ReturnType<typeof useSelectedRows>
</script>

<script lang="ts">
  import Checkbox from '$lib/ui/Checkbox'
  import { getContext, setContext } from 'svelte'
  import { Set } from 'svelte/reactivity'

  let { row }: { row: any } = $props()

  const { selections } = useSelectedRows.getCtx()
</script>

<div class="flex items-center">
  <Checkbox
    onChange={(next) => {
      next ? selections.add(row) : selections.delete(row)
    }}
  ></Checkbox>
</div>
