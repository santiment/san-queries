<script lang="ts" context="module">
  export const TABS = [{ title: 'Editor' }, { title: 'Visualisation' }] as const
</script>

<script lang="ts">
  // import Svg from 'webkit/ui/Svg/svelte'
  import ScreenControls from './ScreenControls.svelte'
  import SQLEditor from '$lib/SQLEditor/index.svelte'
  import VisualisationTab from './Visualisation/index.svelte'
  import Tabs from 'webkit/ui/Tabs'

  export let tab = TABS[0] as (typeof TABS)[number]

  let sqlData: any
</script>

<Tabs class="gap-l mrg-xxl mrg--l" tabs={TABS} selected={tab} onSelect={(item) => (tab = item)}
></Tabs>

<section class="column gap-m">
  <ScreenControls {tab} {sqlData} />

  {#if tab === TABS[0]}
    <SQLEditor />
  {:else}
    <VisualisationTab bind:sqlData />
  {/if}
</section>

<style>
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
