<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showAddQueryToDashboardDialog = (props: { onQueryAdd: (query: any) => void }) =>
    dialogs.__show(Component, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Tabs from 'webkit/ui/Tabs'
  import Svg from 'webkit/ui/Svg/svelte'
  import Search from 'webkit/ui/Search.svelte'
  import Queries from './Queries.svelte'

  export let onQueryAdd: (query: any) => void

  const tabs = [
    { title: 'My queries', icon: 'chart' },
    { title: 'Queries from the community', icon: 'user' },
  ] as const
</script>

<Dialog {...$$props} title="Add queries to this dashboard">
  <div class="dialog-body">
    <Tabs class="gap-s" {tabs} let:item>
      <Svg id={item.icon} w="12"></Svg>
      {item.title}
    </Tabs>

    <Search class="mrg-xl mrg--t mrg--b" big placeholder="Search for a query"></Search>

    <Queries {onQueryAdd}></Queries>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 960px;
  }

  .dialog-body {
    padding: 24px 32px;
  }

  Tabs {
    border-bottom: 1px solid var(--porcelain);
    --tab-padding: 6px 8px;
    --underline-bottom: -1px;
  }
</style>
