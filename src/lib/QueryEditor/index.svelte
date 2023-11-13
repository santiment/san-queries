<script lang="ts" context="module">
  export const TABS = [{ title: 'Editor' }, { title: 'Visualisation' }] as const
</script>

<script lang="ts">
  // import Svg from 'webkit/ui/Svg/svelte'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'
  import ScreenControls from './ScreenControls.svelte'
  import SQLEditor from '$lib/SQLEditor/index.svelte'
  import VisualisationTab from './Visualisation/index.svelte'
  import Tabs from 'webkit/ui/Tabs'

  export let tab = TABS[0] as (typeof TABS)[number]

  const { queryEditor$ } = getQueryEditor$Ctx()

  function onEditorValueChange(sql: string) {
    queryEditor$.set({ sql })
  }

  const editorViewShortcut = GlobalShortcut$('CMD+1', () => (tab = TABS[0]), false)
  $editorViewShortcut

  const visulisationViewShortcut = GlobalShortcut$('CMD+2', () => (tab = TABS[1]), false)
  $visulisationViewShortcut
</script>

<Tabs class="gap-l mrg-xxl mrg--l" tabs={TABS} selected={tab} onSelect={(item) => (tab = item)} />

<section class="column gap-m">
  <ScreenControls {tab} />

  {#if tab === TABS[0]}
    <SQLEditor value={$queryEditor$.sql} onValueChange={onEditorValueChange} />
  {:else}
    <VisualisationTab />
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
