<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Parameter, { COLORS } from '$lib/Parameter'
  import { TABS } from './index.svelte'
  import { showVisualisationFullscreenDialog } from './Visualisation/FullscreenDialog/index.svelte'
  import { showSqlEditorFullscreenDialog$ } from '$lib/SQLEditor/FullscreenDialog.svelte'
  import { showAddParameterDialog$ } from '$lib/Parameter/AddParameterDialog.svelte'
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'

  export let tab = TABS[0] as (typeof TABS)[number]

  const { queryEditor$ } = getQueryEditor$Ctx()

  const showAddParameterDialog = showAddParameterDialog$()
  const showSqlEditorFullscreenDialog = showSqlEditorFullscreenDialog$()

  $: queryEditor = $queryEditor$
  $: ({ parameters, sqlData } = queryEditor)

  function onFullscreenClick() {
    if (tab === TABS[0]) {
      showSqlEditorFullscreenDialog()
    } else {
      if (sqlData) {
        showVisualisationFullscreenDialog({
          title: 'Table widget',
          sqlData,
        })
      }
    }
  }

  function onAddParameterClick() {
    showAddParameterDialog({ strict: true }).then((parameter) => {
      queryEditor$.addParameter(parameter)
    })
  }

  function onParameterClick(parameter: any) {
    showAddParameterDialog({ parameter, strict: true }).then(() => {
      queryEditor$.updateParameters()
    })
  }
</script>

<header class="row justify gap-xl">
  <parameters class="row gap-s">
    <button class="parameter btn row v-center gap-s c-waterloo" on:click={onAddParameterClick}>
      <Svg id="braces" w="16" />
      Parameter
    </button>

    <button class="info btn-3 c-waterloo">
      <Svg id="info" w="12" />
    </button>

    {#each parameters as parameter, i}
      <Parameter
        {parameter}
        color={COLORS[i]}
        on:click={() => onParameterClick(parameter)}
        onRemoveClick={console.log}
      />
    {/each}
  </parameters>

  <actions class="row gap-s c-waterloo nowrap">
    {#if tab === TABS[0]}
      <button class="btn-3">
        <Svg id="report" w="16" />
      </button>
    {:else}
      <button class="btn-2">Add to dashboard</button>

      <button class="download btn row v-center gap-s expl-tooltip" aria-label="Download CSV">
        <Svg id="download" w="16" />

        CSV
      </button>
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

  .info {
    margin: 0 8px 0 -8px;
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
