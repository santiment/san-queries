<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showAddQueryToDashboardDialog = () => dialogs.__show(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Tabs from 'webkit/ui/Tabs'
  import Svg from 'webkit/ui/Svg/svelte'

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
