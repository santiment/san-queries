<script lang="ts">
  import Button from '$lib/ui/Button.svelte'
  import { TABS, type TabType } from '../Tabs.svelte'
  import { showVisualisationFullscreenDialog$ } from '../VisualisationTab/FullscreenDialog.svelte'

  let {
    selectedTab,
    sqlData,
    readonly,
  }: {
    selectedTab: TabType
    sqlData: App.SqlData
    readonly: boolean
  } = $props()

  const showVisualisationFullscreenDialog = showVisualisationFullscreenDialog$()

  function onClick() {
    if (selectedTab === TABS[1]) {
      return showVisualisationFullscreenDialog({ sqlData, readonly })
    } else {
      return showVisualisationFullscreenDialog({ sqlData, readonly })
    }
  }
</script>

{#if selectedTab !== TABS[2]}
  <Button icon="fullscreen" iconSize="14" explanation="Fullscreen" onclick={onClick}></Button>
{/if}
