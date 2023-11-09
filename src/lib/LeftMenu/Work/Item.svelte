<script lang="ts">
  import type {
    /* FolderTreeType, */
    ItemTreeType,
  } from './types'

  import { TreeItemType } from './types'
  import MenuItem from '../MenuItem.svelte'
  import Renamer from '$lib/Renamer.svelte'
  import { getWorkspace$Ctx } from './ctx'

  export let idx: number
  export let item: ItemTreeType
  export let parent: any // FolderTreeType
  export let onItemDragEnd: any
  export let onItemDragStart: any

  const { workspace$ } = getWorkspace$Ctx()

  let isRenaming = false

  $: isQuery = item.type === TreeItemType.QUERY

  function onRename(value: string) {
    item.name = value
  }
  function onRenameClick() {
    isRenaming = true
  }

  function onDuplicateClick() {
    workspace$.duplicateItem(parent, item, idx)
  }

  function onDeleteClick() {
    workspace$.deleteItem(parent, idx)
  }

  // function onItemClick() {
  //   if (isQuery) return
  //
  //   const data = JSON.parse((item as any).data) as any
  //
  //   goto('/dashboard/new').then(() => {
  //     // @ts-ignore
  //     window.updateDashboardEditor(data)
  //   })
  // }
</script>

<MenuItem
  draggable
  moreActions
  icon={isQuery ? 'query' : 'dashboard'}
  on:dragstart={(e) => onItemDragStart(e, parent, item)}
  on:dragend={onItemDragEnd}
  {onRenameClick}
  {onDuplicateClick}
  {onDeleteClick}
>
  <Renamer title={item.name} bind:isRenaming {onRename} let:value>
    <a
      href="/{item.type === TreeItemType.QUERY ? 'query' : 'dashboard'}/new?data={item.data}"
      class="link-as-bg">{value}</a
    >
  </Renamer>
</MenuItem>

<style>
  a:hover {
    color: var(--black);
  }
</style>
