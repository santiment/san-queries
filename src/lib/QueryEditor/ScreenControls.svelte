<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { downloadCsv } from 'webkit/utils/csv'
  import Parameter, { COLORS } from '$lib/Parameter'
  import { TABS } from './index.svelte'
  import { showVisualisationFullscreenDialog } from './Visualisation/FullscreenDialog/index.svelte'
  import { showSqlEditorFullscreenDialog$ } from '$lib/SQLEditor/FullscreenDialog.svelte'
  import { showAddParameterDialog$ } from '$lib/Parameter/AddParameterDialog.svelte'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import ExecutionStats from './ExecutionStats.svelte'
  import { showAddQueryToDashboardDialog } from '$lib/DashboardEditor/AddQueryToDashboardDialog/index.svelte'
  import { showAddToDashboardDialog } from './AddToDashboardDialog/index.svelte'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { mutateCreateDashboardQuery } from '$lib/api/dashboard/create'
  import { track } from 'san-webkit/lib/analytics'
  import ParameterInfoTooltip from './ParameterInfoTooltip.svelte'

  export let tab = TABS[0] as (typeof TABS)[number]

  const { queryEditor$ } = getQueryEditor$Ctx()
  const { currentUser$ } = getCurrentUser$Ctx()

  const showAddParameterDialog = showAddParameterDialog$()
  const showSqlEditorFullscreenDialog = showSqlEditorFullscreenDialog$()

  $: currentUser = $currentUser$
  $: queryEditor = $queryEditor$
  $: ({ parameters, sqlData } = queryEditor)

  function onFullscreenClick() {
    if (tab === TABS[0]) {
      track.event('fullscreen', {
        category: 'Interaction',
        source: 'query_editor_sql',
        source_url: window.location.href,
      })

      showSqlEditorFullscreenDialog()
    } else {
      if (sqlData) {
        track.event('fullscreen', {
          category: 'Interaction',
          source: 'query_editor_visualisation',
          source_url: window.location.href,
        })

        showVisualisationFullscreenDialog({
          title: 'Table widget',
          sqlData,
        })
      }
    }
  }

  function onAddParameterClick() {
    track.event('add_parameter_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    showAddParameterDialog({ strict: true }).then((parameter) => {
      queryEditor$.addParameter(parameter)
    })
  }

  function onParameterClick(parameter: App.Parameter) {
    track.event('parameter_click', {
      category: 'Interaction',
      parameter: parameter.key,
      value: parameter.value,
      source_url: window.location.href,
    })

    showAddParameterDialog({ parameter, strict: true }).then(() => {
      queryEditor$.updateParameters()
    })
  }

  function onParameterRemove(i: number, parameter: any) {
    track.event('parameter_delete', {
      category: 'Interaction',
      parameter: parameter.key,
      source_url: window.location.href,
    })

    queryEditor$.removeParameter(i)
  }

  function onDownloadCsvClick() {
    console.log($queryEditor$)
    const { name, sqlData } = $queryEditor$

    const columns = sqlData.headers.map((title, i) => ({ title, format: (v) => v[i] }))

    downloadCsv(name, columns, sqlData.rows)
  }

  function onAddToDashboardClick() {
    showAddToDashboardDialog({
      currentUser,
      queryEditor,
      onQueryAdd: (dashboard) => {
        if (!queryEditor.query) return
        mutateCreateDashboardQuery({ dashboardId: dashboard.id, queryId: queryEditor.query.id })
      },
    })
  }
</script>

<header class="row justify gap-xl">
  <parameters class="row gap-s">
    <button class="parameter btn row v-center gap-s c-waterloo" on:click={onAddParameterClick}>
      <Svg id="braces" w="16" />
      Parameter
    </button>

    <ParameterInfoTooltip />

    {#each parameters as parameter, i}
      <Parameter
        {parameter}
        color={COLORS[i]}
        on:click={() => onParameterClick(parameter)}
        onRemoveClick={() => onParameterRemove(i, parameter)}
      />
    {/each}
  </parameters>

  <actions class="row gap-s c-waterloo nowrap">
    {#if tab === TABS[1]}
      {#if currentUser}
        <button class="btn-2" on:click={onAddToDashboardClick}>Add to dashboard</button>
      {/if}

      <button
        class="download btn row v-center gap-s expl-tooltip"
        aria-label="Download CSV"
        on:click={onDownloadCsvClick}
      >
        <Svg id="download" w="16" />

        CSV
      </button>
    {/if}

    <ExecutionStats {sqlData} />

    {#if tab === TABS[0]}
      <a
        class="btn-3"
        href="https://academy.santiment.net/santiment-queries/"
        data-source="query_editor_sql"
        data-type="documentation"
      >
        <Svg id="report" w="16" />
      </a>
    {/if}

    <button class="btn-3 expl-tooltip" aria-label="Open fullscreen" on:click={onFullscreenClick}>
      <Svg id="fullscreen" w="14" />
    </button>
  </actions>
</header>

<style>
  parameters {
    flex-wrap: wrap;
  }

  .parameter {
    padding: 6px 8px;
  }

  .download {
    padding: 0 8px;
  }

  button {
    --color-hover: var(--green);
  }

  .btn-2 {
    --border: var(--green);
  }

  .expl-tooltip {
    --expl-right: 0;
  }
</style>
