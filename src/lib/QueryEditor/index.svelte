<script lang="ts" context="module">
  export const TABS = ['Editor', 'Visualisation'] as const
</script>

<script lang="ts">
  // import Svg from 'webkit/ui/Svg/svelte'
  import ScreenControls from './ScreenControls.svelte'
  import SQLEditor from '$lib/SQLEditor/index.svelte'
  import VisualisationTab from './Visualisation/index.svelte'

  export let tab = TABS[0] as (typeof TABS)[number]
</script>

<tabs class="row gap-l mrg-xxl mrg--l">
  {#each TABS as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <tab class="btn" class:active={tab === item} on:click={() => (tab = item)}>{item}</tab>
  {/each}
</tabs>

<section class="column gap-m">
  <ScreenControls {tab} />

  {#if tab === 'Editor'}
    <SQLEditor />
  {:else}
    <VisualisationTab />
  {/if}
</section>

<style>
  tab {
    border-bottom: 1px solid transparent;
    border-radius: 0;
    padding: 0 0 7px;
  }

  .active {
    --color: var(--green);
    border-bottom-color: var(--green);
  }

  section {
    border-radius: 6px;
    padding: 20px 24px;
    background: var(--athens);
    flex: 1;
  }

  SQLEditor {
    --border-radius: 6px;
  }
</style>
