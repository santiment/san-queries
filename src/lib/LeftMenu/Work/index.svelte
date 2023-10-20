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
    WorkspaceTree.push({
      type: TreeItemType.FOLDER,
      name: 'Untitled folder',
      children: [],
    })
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

{#each WorkspaceTree as item}
  {@const { type } = item}
  {#if type === TreeItemType.FOLDER}
    <Folder title={item.name}>
      {#each item.children as item}
        {@const { type } = item}
        <MenuItem moreActions icon={type === TreeItemType.QUERY ? 'query' : 'dashboard'}>
          {item.name}
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
</style>
