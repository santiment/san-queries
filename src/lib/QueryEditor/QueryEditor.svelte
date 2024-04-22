<script lang="ts">
  import type { TRawSqlData } from './api'

  import Button from '$lib/ui/Button.svelte'
  import Header from './Header.svelte'
  import Tabs, { TABS, type TabType } from './Tabs.svelte'
  import ErrorsTab from './ErrorsTab.svelte'
  import EditorTab from './EditorTab.svelte'
  import SaveIndicator from '$lib/SaveIndicator'
  import ExecutionStats, { useExecutionStatsCtx } from './ExecutionStats'
  import VisualisationTab from './VisualisationTab/index.svelte'
  import { cn } from '$lib/ui/utils'
  import { unwrapState, useQueryEditorCtx } from './ctx'
  import Parameters from './Parameters.svelte'
  import { getTimeFormats } from 'san-webkit/lib/utils/dates'
  import { untrack, type ComponentProps } from 'svelte'
  import { track } from 'san-webkit/lib/analytics'
  import { showParameterDialog$ } from '$lib/ParameterDialog/index.svelte'
  import { useExecuteButtonCtx } from './ExecuteButton.svelte'
  import { ss, useObservable } from 'svelte-runes'
  import { useQueryExecuteFlow } from './flow/execute.svelte'
  import { useStoreSqlDataCache } from './flow/dataCache'
  import { useGetSqlDataCache } from './flow/dataCache/index.svelte'

  let {
    query,
    isAuthor = false,
    currentUser = null,
    tab = TABS[0],

    onSaveClick,
    onDuplicateClick,
    onDeleteClick,
    onSqlChange,
    onParametersChange,
  }: {
    query?: App.ApiQuery
    sqlData?: App.SqlData
    currentUser?: any

    tab?: TabType
    isAuthor: boolean
    onSaveClick: () => void
    onDuplicateClick: () => void
    onDeleteClick: () => void
    onSqlChange?: ComponentProps<EditorTab>['onSqlChange']
    onParametersChange: () => void
  } = $props()

  const sqlData = ss({ rows: [], columns: [], columnTypes: [] } as App.SqlData)
  const { queryEditor } = useQueryEditorCtx(query)
  const _executeButtonCtx = useExecuteButtonCtx()
  const executionStatsCtx = useExecutionStatsCtx()

  const showParameterDialog = showParameterDialog$()

  const executionStats = useObservable(executionStatsCtx.stats$)
  const { onExecuteClick, executionData$ } = useQueryExecuteFlow(onExecuteResult, onExecuteError)

  useStoreSqlDataCache(executionData$)
  useGetSqlDataCache(query?.id, setSqlData)

  let readonly = $derived(!isAuthor)
  let selectedTab = $state.frozen(tab)
  let errors = $state.frozen([] as { date: string; details: string }[])
  let stats = $derived(executionStats.$)

  function setSqlData(data?: App.SqlData) {
    sqlData.$ = data || { rows: [], columns: [], columnTypes: [] }
  }
  function onExecuteResult(data?: TRawSqlData) {
    setSqlData(data)
    onTabSelect(TABS[1])
  }

  function onExecuteError(error: TError | TError[]) {
    addErrors(error)
    onTabSelect(TABS[2])
  }

  export function onTabSelect(tab: TabType) {
    selectedTab = tab
  }

  type TError = { message: string; details?: string }
  export function addErrors(error: TError | TError[]) {
    const _errors = (Array.isArray(error) ? error : [error]).map((error) => {
      const { message, details = message } = error
      const { HH, mm, ss } = getTimeFormats(new Date())

      return {
        date: `${HH}:${mm}:${ss}`,
        details: details.replace('FORMAT JSONCompact', '').trim(),
      }
    })

    errors = [..._errors, ...errors]
  }

  export function getState() {
    return untrack(() => unwrapState(queryEditor))
  }

  // TODO: Maybe move to Parameters component?
  function onAddParameterClick() {
    track.event('add_parameter_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    if (readonly) return

    showParameterDialog({ strict: true }).then((parameter) => {
      const { parameters } = queryEditor

      parameters.$.push(parameter)
      parameters.$ = parameters.$

      onParametersChange()
    })
  }
</script>

<SaveIndicator></SaveIndicator>

<article class="flex max-h-[calc(100vh-65px)] min-w-0 flex-1 flex-col p-6 pb-0">
  <Header
    {stats}
    author={query?.user || currentUser}
    {isAuthor}
    {currentUser}
    onExecuteClick={() => onExecuteClick(getState())}
    {onDuplicateClick}
    {onSaveClick}
    {onDeleteClick}
  ></Header>

  <Tabs tab={selectedTab} {onTabSelect}></Tabs>

  <section class="flex min-h-0 flex-1 flex-col gap-3 rounded-md bg-athens px-6 py-[20px]">
    <div class="flex">
      <Parameters {isAuthor} onChange={onParametersChange}></Parameters>

      <div class="ml-auto flex items-center gap-2 whitespace-nowrap fill-waterloo">
        {#if isAuthor}
          <Button
            variant="border"
            icon="braces"
            class="border-mystic hover:text-green"
            onclick={onAddParameterClick}
          >
            Add Parameter
          </Button>
        {/if}

        {#if selectedTab === TABS[1]}
          <Button
            icon="download"
            class="px-2 text-waterloo hover:fill-green hover:text-green"
            explanation="Download CSV"
          >
            CSV
          </Button>
        {/if}

        <ExecutionStats {stats}>
          {#snippet children({ action, trigger })}
            <Button icon="coin" {action} actionArgs={trigger}></Button>
          {/snippet}
        </ExecutionStats>

        {#if selectedTab === TABS[0]}
          <Button icon="report" href="https://academy.santiment.net/santiment-queries/"></Button>
        {/if}

        {#if selectedTab !== TABS[2]}
          <Button icon="fullscreen" iconSize="14" explanation="Fullscreen"></Button>
        {/if}
      </div>
    </div>

    <main
      class={cn(
        'flex min-h-0 flex-1 gap-4 rounded-md bg-white',
        selectedTab !== TABS[0] && 'px-6 py-4',
      )}
    >
      {#if selectedTab === TABS[0]}
        <EditorTab {readonly} {onSqlChange}></EditorTab>
      {:else if selectedTab === TABS[1]}
        {#key sqlData.$}
          <VisualisationTab sqlData={sqlData.$} {readonly}></VisualisationTab>
        {/key}
      {:else}
        <ErrorsTab {errors}></ErrorsTab>
      {/if}
    </main>
  </section>
</article>
