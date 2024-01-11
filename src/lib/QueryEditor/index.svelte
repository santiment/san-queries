<script lang="ts" context="module">
  import { CMD } from 'webkit/utils/os'

  export const TABS = [
    { title: 'Editor', ariaLabel: `${CMD} + 1` },
    { title: 'Visualisation', ariaLabel: `${CMD} + 2` },
    { title: 'Errors', ariaLabel: `${CMD} + 3` },
  ] as const
</script>

<script lang="ts">
  // import Svg from 'webkit/ui/Svg/svelte'
  import { track } from 'webkit/analytics'
  import Tabs from 'webkit/ui/Tabs'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import ScreenControls from './ScreenControls.svelte'
  import Errors from './Errors/index.svelte'
  import SQLEditor from '$lib/SQLEditor/index.svelte'
  import VisualisationTab from './Visualisation/index.svelte'
  import {
    EventQuerySave$,
    EventQueryExecute$,
    EventTableInsertSql$,
  } from '$routes/(editor)/query/events'

  export let tab = TABS[0] as (typeof TABS)[number]

  const { queryEditor$ } = getQueryEditor$Ctx()

  let SqlEditorNode: null | SQLEditor

  $: queryEditor = $queryEditor$
  $: ({ sql, parameters } = queryEditor)

  export function getEditor() {
    return SqlEditorNode?.getEditor()
  }

  function onEditorValueChange(sql: string) {
    queryEditor$.setSql(sql)
  }

  const editorViewShortcut = GlobalShortcut$(
    'CMD+1',
    () => {
      trackTabSelect(TABS[0], 'keyboard_shortcut')
      tab = TABS[0]
    },
    false,
  )
  $editorViewShortcut

  const visulisationViewShortcut = GlobalShortcut$(
    'CMD+2',
    () => {
      trackTabSelect(TABS[1], 'keyboard_shortcut')
      tab = TABS[1]
    },
    false,
  )
  $visulisationViewShortcut

  const errorsViewShortcut = GlobalShortcut$(
    'CMD+3',
    () => {
      trackTabSelect(TABS[2], 'keyboard_shortcut')
      tab = TABS[2]
    },
    false,
  )
  $errorsViewShortcut

  function updateSql() {
    if (SqlEditorNode && SqlEditorNode.getValue) {
      Object.assign(queryEditor, { sql: SqlEditorNode.getValue() })
    }
  }
  const eventQuerySave = EventQuerySave$(updateSql)
  $eventQuerySave

  const eventQueryExecute = EventQueryExecute$(updateSql)
  $eventQueryExecute

  $: id = queryEditor.query?.id
  $: console.log(queryEditor, id)

  function trackTabSelect(newTab: any, triggered_by = 'click') {
    track.event('tab_select', {
      category: 'Interaction',
      source: 'query_editor',
      triggered_by,
      tab: newTab.title,
      old_tab: tab.title,
      source_url: window.location.href,
    })
  }

  function onTabSelect(item: any) {
    trackTabSelect(item)

    tab = item
  }

  const eventTableInsertSql = EventTableInsertSql$(onDataInsertSql)
  $eventTableInsertSql

  function onDataInsertSql({ text }: { text: string }) {
    const editor = SqlEditorNode?.getEditor()
    if (!editor) return

    editor.trigger('keyboard', 'type', { text })
  }
</script>

<Tabs
  class="gap-l mrg-xxl mrg--l"
  tabClass="expl-tooltip"
  tabs={TABS}
  selected={tab}
  onSelect={onTabSelect}
/>

<section class="column gap-m">
  <ScreenControls {tab} />

  {#if tab === TABS[0]}
    {#key id}
      <SQLEditor
        bind:this={SqlEditorNode}
        {id}
        value={sql}
        {parameters}
        onValueChange={onEditorValueChange}
      />
    {/key}
  {:else if tab === TABS[1]}
    <VisualisationTab />
  {:else if tab === TABS[2]}
    <Errors />
  {/if}
</section>

<style>
  section {
    border-radius: 6px;
    padding: 20px 24px;
    background: var(--athens);
    flex: 1;
    min-height: 0;
  }

  SQLEditor {
    --border-radius: 6px;
  }

  Tabs {
    overflow: visible !important;
  }
</style>
