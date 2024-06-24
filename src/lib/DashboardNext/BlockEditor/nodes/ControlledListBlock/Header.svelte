<script lang="ts">
  import { HCell } from '$lib/ui/Table'
  import Button from 'san-webkit-next/ui/core/Button'
  import { useControllerListCtx } from './ctx'

  let { column }: { column: any } = $props()

  const { resetList } = useControllerListCtx()
</script>

<HCell {column} class="flex justify-between gap-2">
  Selected items

  <Button class="size-auto text-red hover:text-red-hover" onclick={resetList}>Reset</Button>
</HCell>
