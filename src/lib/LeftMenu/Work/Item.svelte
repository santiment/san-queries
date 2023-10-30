<script lang="ts">
  import type { FolderTreeType, ItemTreeType } from './types'

  import { TreeItemType, getRerenderTreeCtx } from './types'
  import MenuItem from '../MenuItem.svelte'

  export let item: ItemTreeType
  export let parent: FolderTreeType
  export let onItemDragEnd: any
  export let onItemDragStart: any

  const { rerenderTree } = getRerenderTreeCtx()

  function onDeleteClick() {
    const index = parent.children.findIndex((v) => v === item)

    if (index === -1) return

    parent.children.splice(index, 1)
    rerenderTree()
  }
</script>

<MenuItem
  draggable
  moreActions
  icon={item.type === TreeItemType.QUERY ? 'query' : 'dashboard'}
  on:dragstart={(e) => onItemDragStart(e, parent, item)}
  on:dragend={onItemDragEnd}
  onRenameClick={console.log}
  onDuplicateClick={console.log}
  {onDeleteClick}
>
  {item.name}
</MenuItem>

<style>
</style>
