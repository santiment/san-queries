<script lang="ts">
  import type {
    /* FolderTreeType, */
    ItemTreeType,
  } from './types'

  import { TreeItemType, getRerenderTreeCtx } from './types'
  import MenuItem from '../MenuItem.svelte'
  import Renamer from '$lib/Renamer.svelte'
  import { goto } from '$app/navigation'

  export let idx: number
  export let item: ItemTreeType
  export let parent: any // FolderTreeType
  export let onItemDragEnd: any
  export let onItemDragStart: any

  const { rerenderTree } = getRerenderTreeCtx()

  let isRenaming = false

  $: isQuery = item.type === TreeItemType.QUERY

  function onRename(value: string) {
    item.name = value
  }
  function onRenameClick() {
    isRenaming = true
  }

  function onDuplicateClick() {
    const p = parent.children || parent
    p.splice(idx + 1, 0, { ...item, name: item.name + ' copy' })
    rerenderTree()
  }

  function onDeleteClick() {
    const p = parent.children || parent
    p.splice(idx, 1)
    rerenderTree()
  }

  function onItemClick() {
    if (isQuery) return

    const data = JSON.parse((item as any).data) as any

    goto('/dashboard/new')
    // @ts-ignore
    window.updateDashboardEditor(data)
  }
</script>

<MenuItem
  draggable
  moreActions
  icon={isQuery ? 'query' : 'dashboard'}
  on:click={onItemClick}
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
