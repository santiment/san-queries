<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
  import { getSearch$Ctx } from '../Search.svelte'

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

  const { search$ } = getSearch$Ctx()

  let dragState = null as null | { folder: any; item: any; hoverNode: HTMLElement }

  $: filteredTree = search$.modify($search$, WorkspaceTree, filterTree)

  function filterTree(input: RegExp, tree: typeof WorkspaceTree) {
    return tree
      .map((item) => {
        if (!item.children) {
          return item.name.search(input) >= 0 ? item : null
        }

        const children = item.children.filter((child) => child.name.search(input) >= 0)
        if (children.length) {
          return { ...item, children, source: item }
        }

        return null
      })
      .filter(Boolean)
  }

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

  function onItemDragStart(e: DragEvent, folder: any, item: any) {
    const node = e.currentTarget as HTMLElement
    const folderNode = node.closest('folder') as null | HTMLElement
    const hoverNode = folderNode && getDragFolderHighlightNode(folderNode)

    if (!hoverNode) return

    dragState = { folder: folder.source || folder, item, hoverNode }
    hoverNode?.classList.add('dropzone')
  }

  function onItemDragEnd() {
    dragState?.hoverNode.classList.remove('dropzone')
    dragState = null
  }

  function onFolderDragOver(e: DragEvent) {
    e.preventDefault()

    if (!dragState) return

    const node = e.currentTarget as HTMLElement
    const hoverNode = getDragFolderHighlightNode(node)

    if (hoverNode === dragState.hoverNode) return

    dragState.hoverNode.classList.remove('dropzone')
    dragState.hoverNode = hoverNode

    hoverNode.classList.add('dropzone')
  }

  function onFolderDrop(e: DragEvent, folder: any) {
    e.preventDefault()

    if (!dragState || folder === dragState.folder) return

    const target = folder.source || folder
    const index = dragState.folder.children.findIndex((item) => item === dragState?.item)

    dragState.folder.children.splice(index, 1)
    target.children.push(dragState.item)

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

{#each filteredTree as item (item)}
  {@const { type } = item}
  {#if type === TreeItemType.FOLDER}
    <Folder
      folder={item}
      title={item.name}
      on:dragover={onFolderDragOver}
      on:drop={(e) => onFolderDrop(e, item)}
    >
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
    position: relative;
    --color: var(--green);

    &::before {
      background: var(--green-light-1);
      content: '';
      position: absolute;
      display: block;
      border-radius: 4px;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
  }
</style>
