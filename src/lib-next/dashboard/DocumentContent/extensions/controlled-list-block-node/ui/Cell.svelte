<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { useControllerListCtx } from '../ctx'

  let { row }: { row: string } = $props()

  const { deleteItem } = useControllerListCtx.get()
</script>

<div class="flex items-center gap-2">
  {row}

  <Button
    icon="delete"
    iconSize="12"
    class="invisible size-auto fill-red hover:fill-red-hover group-hover:visible"
    explanation="Delete item"
    onclick={() => deleteItem(row)}
  ></Button>
</div>

<style>
  div {
    --expl-right: -4px;
  }
</style>
