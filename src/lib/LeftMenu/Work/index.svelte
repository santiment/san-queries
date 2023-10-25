<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'

  const TreeItemType = {
    FOLDER: 'FOLDER',
    QUERY: 'QUERY',
    DASHBOARD: 'DASHBOARD',
  } as const

  let WorkspaceTree = [
    {
      type: TreeItemType.FOLDER,
      name: "Let's get you started",
      children: [
        {
          type: TreeItemType.QUERY,
          name: 'Data exploration',
        },
        {
          type: TreeItemType.QUERY,
          name: 'Commands',
        },
        {
          type: TreeItemType.QUERY,
          name: 'Functions',
        },
        {
          type: TreeItemType.DASHBOARD,
          name: 'Get started dashboard',
        },
      ],
    },
  ]

  function onNewFolderClick() {
    WorkspaceTree.unshift({
      type: TreeItemType.FOLDER,
      name: 'Untitled folder',
      children: [],
    })
    WorkspaceTree = WorkspaceTree
  }

  const getDragFolderHighlightNode = (folderNode: HTMLElement) =>
    folderNode.firstElementChild as HTMLElement

  let dragState = null
  function onItemDragStart(e: DragEvent, folder: any, item: any) {
    const node = e.currentTarget as HTMLElement
    const folderNode = node.closest('folder') as null | HTMLElement
    const hoverNode = folderNode && getDragFolderHighlightNode(folderNode)

    dragState = { folder, item, hoverNode }
    hoverNode?.classList.add('dropzone')
  }

  function onItemDragEnd() {
    dragState.hoverNode?.classList.remove('dropzone')
    dragState = null
  }

  function onFolderDragOver(e: DragEvent) {
    e.preventDefault()

    if (!dragState) return

    const node = e.currentTarget
    const hoverNode = getDragFolderHighlightNode(node)

    if (hoverNode === dragState.hoverNode) return

    dragState.hoverNode.classList.remove('dropzone')
    dragState.hoverNode = hoverNode

    hoverNode.classList.add('dropzone')
  }

  function onFolderDrop(e: DragEvent, folder: any) {
    e.preventDefault()

    if (!dragState || folder === dragState.folder) return

    const index = dragState.folder.children.findIndex((item) => item === dragState.item)

    dragState.folder.children.splice(index, 1)
    folder.children.push(dragState.item)

    onItemDragEnd()
    WorkspaceTree = WorkspaceTree
  }
</script>

<section class="row v-center justify mrg-s mrg--b">
  <h2 class="txt-m">My Workspace</h2>

  <actions class="row v-center">
    <button class="btn-3 expl-tooltip" aria-label="New folder" on:click={onNewFolderClick}>
      <Svg id="new-folder" w="12" />
    </button>
  </actions>
</section>

{#each WorkspaceTree as item (item)}
  {@const { type } = item}
  {#if type === TreeItemType.FOLDER}
    <Folder title={item.name} on:dragover={onFolderDragOver} on:drop={(e) => onFolderDrop(e, item)}>
      {#each item.children as child (child)}
        {@const { type } = child}
        <MenuItem
          draggable
          moreActions
          icon={type === TreeItemType.QUERY ? 'query' : 'dashboard'}
          on:dragstart={(e) => onItemDragStart(e, item, child)}
          on:dragend={onItemDragEnd}
        >
          {child.name}
        </MenuItem>
      {/each}
    </Folder>
  {/if}
{/each}

<style lang="scss">
  .expl-tooltip {
    --expl-position-y: 4px;
    --expl-right: 0;
  }

  :global(.dropzone) {
    background: red;
  }
</style>
