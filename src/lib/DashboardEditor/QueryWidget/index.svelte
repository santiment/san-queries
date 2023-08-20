<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'

  export let widget: App.Dashboard.QueryWidget

  let sqlData: any
  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: if (process.browser) {
    getData()
  }

  function getData() {
    queryComputeRawClickhouseQuery().then((data) => {
      sqlData = data
    })
  }

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)
  }
</script>

<query-widget class="column border">
  <header class="row v-center fluid gap-s">
    <h2 class="body-2">{widget.title}</h2>

    <button class="btn-3 mrg-a mrg--l" on:click={console.log}>
      <Svg id="refresh" w="14" />
    </button>

    <button class="btn-3" on:click={console.log}>
      <Svg id="fullscreen" w="14" />
    </button>

    <button class="close btn-3" on:click={onCloseClick}>
      <Svg id="close" w="14" />
    </button>
  </header>

  <Table border={false} {sqlData} />
</query-widget>

<style>
  header {
    padding: 12px 18px 12px 12px;
    border-bottom: 1px solid var(--porcelain);
  }

  Table {
    max-height: calc(100% - 57px);
  }
</style>
