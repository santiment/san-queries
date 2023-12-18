<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showVisualisationFullscreenDialog = (props: {
    title: string
    sqlData: App.SqlData
    settings: any
  }) => dialogs.__show(Component, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import Chart from '$lib/QueryEditor/Visualisation/Chart/index.svelte'

  export let title: string
  export let sqlData: App.SqlData
  export let settings = {} as any
</script>

<Dialog {...$$props} {title}>
  {#if settings.visualisation === 'Chart'}
    <Chart {sqlData} ColumnSettings={settings.columns} metricsClass="$style.metrics" />
  {:else}
    <Table border={false} {sqlData} ColumnSettings={settings.columns} />
  {/if}
</Dialog>

<style lang="scss">
  Dialog {
    min-width: 90%;
    min-height: 80%;
  }

  Table {
    overflow: auto;
  }

  .metrics {
    margin: 8px 8px 0;
  }

  Chart {
    padding: 8px;
  }
</style>
