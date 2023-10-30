<script lang="ts">
  import type { FolderTreeType, ItemTreeType } from './types'

  import { TreeItemType, getRerenderTreeCtx } from './types'
  import MenuItem from '../MenuItem.svelte'
  import Renamer from '$lib/Renamer.svelte'

  export let idx: number
  export let item: ItemTreeType
  export let parent: FolderTreeType
  export let onItemDragEnd: any
  export let onItemDragStart: any

  const { rerenderTree } = getRerenderTreeCtx()

  let isRenaming = false

  function onRename(value: string) {
    item.name = value
  }
  function onRenameClick() {
    isRenaming = true
  }

  function onDuplicateClick() {
    parent.children.splice(idx + 1, 0, { ...item, name: item.name + ' copy' })
    rerenderTree()
  }

  function onDeleteClick() {
    parent.children.splice(idx, 1)
    rerenderTree()
  }
</script>

<MenuItem
  draggable
  moreActions
  icon={item.type === TreeItemType.QUERY ? 'query' : 'dashboard'}
  on:dragstart={(e) => onItemDragStart(e, parent, item)}
  on:dragend={onItemDragEnd}
  {onRenameClick}
  {onDuplicateClick}
  {onDeleteClick}
>
  <Renamer title={item.name} bind:isRenaming {onRename} />
</MenuItem>

<style>
</style>
