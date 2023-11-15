<script lang="ts">
  import type { WorkspaceTreeType, FolderTreeType, ItemTreeType } from './types'

  import Svg from 'webkit/ui/Svg/svelte'
  import { TreeItemType } from './types'
  import Folder from '../Folder.svelte'
  import { getSearch$Ctx } from '../Search.svelte'
  import Item from './Item.svelte'
  import { getWorkspace$Ctx } from './ctx'
  import { queryGetUserQueries } from '$lib/api/query/get'

  const { workspace$ } = getWorkspace$Ctx()
  const { search$ } = getSearch$Ctx()

  let dragState = null as null | {
    folder: FolderTreeType
    item: ItemTreeType
    hoverNode: HTMLElement | null
  }

  $: tree = $workspace$
  $: filteredTree = search$.modify($search$, tree.children, filterTree)

  let queries = [] as any[]
  $: if (process.browser) {
    queryGetUserQueries().then((data) => {
      queries = data.map((query) => ({
        ...query,
        type: TreeItemType.QUERY,
      }))
    })
  }

  function filterTree(input: RegExp, tree: WorkspaceTreeType) {
    return tree
      .map((item) => {
        if ('children' in item) {
          const children = item.children.filter((child) => child.name.search(input) >= 0)
          if (children.length) {
            return { ...item, children, source: item }
          }

          return null
        }

        return item.name.search(input) >= 0 ? item : null
      })
      .filter(Boolean) as WorkspaceTreeType
  }

  function onNewFolderClick() {
    workspace$.newFolder()
  }

  const getDragFolderHighlightNode = (folderNode: HTMLElement) =>
    folderNode.firstElementChild as HTMLElement

  function onItemDragStart(e: DragEvent, folder: any, item: any) {
    const node = e.currentTarget as HTMLElement
    const folderNode = node.closest('folder') as null | HTMLElement
    const hoverNode = folderNode && getDragFolderHighlightNode(folderNode)

    // if (!hoverNode) return

    dragState = { folder: folder.source || folder, item, hoverNode }
    hoverNode?.classList.add('dropzone')
  }

  function onItemDragEnd() {
    dragState?.hoverNode?.classList.remove('dropzone')
    dragState = null
  }

  function onFolderDragOver(e: DragEvent) {
    e.preventDefault()

    if (!dragState) return

    const node = e.currentTarget as HTMLElement
    const hoverNode = getDragFolderHighlightNode(node)

    if (hoverNode === dragState.hoverNode) return

    dragState.hoverNode?.classList.remove('dropzone')
    dragState.hoverNode = hoverNode

    hoverNode.classList.add('dropzone')
  }

  function onFolderDrop(e: DragEvent, targetFolder: any) {
    e.preventDefault()

    const { folder: sourceFolder, item } = dragState || {}

    if (!sourceFolder) return
    if (!item || sourceFolder === targetFolder) return

    workspace$.moveItemToFolder(sourceFolder, targetFolder.source || targetFolder, item)

    onItemDragEnd()
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

<!--
{#each filteredTree as item, i (item)}
  {@const { type } = item}
  {#if type === TreeItemType.FOLDER}
    <Folder
      folder={item}
      title={item.name}
      on:dragover={onFolderDragOver}
      on:drop={(e) => onFolderDrop(e, item)}
    >
      {#each item.children as child, i (child)}
        <Item idx={i} item={child} parent={item} {onItemDragStart} {onItemDragEnd} />
      {/each}
    </Folder>
  {:else}
    <Item idx={i} {item} parent={tree} {onItemDragStart} {onItemDragEnd} />
  {/if}
{/each}

-->

<Folder title="My Queries">
  {#each queries as item, i}
    <Item
      idx={i}
      {item}
      parent={queries}
      onItemDragStart={console.log}
      onItemDragEnd={console.log}
    />
  {/each}
</Folder>

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
