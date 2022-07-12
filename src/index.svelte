<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Query from './Query.svelte'
  import Result from './Result.svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { Formatter, FormatType } from './Result/Options/Format.svelte'
  import CreationInfo from './Header/CreationInfo.svelte'

  let data

  $: columns = data ? data.headers.map(newColumn) : []
  $: console.log(data)

  function newColumn(title, i) {
    const accessor = (data) => data[i]

    const column = {
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (data.dateColumns.has(i)) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatterId = id
    }

    return column
  }
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <div class="row v-center mrg-xl mrg--b">
      <CreationInfo />

      <button class="btn mrg-a mrg--l row v-center">
        <Svg id="copy" w="16" class="mrg-s mrg--r" />
        Duplicate</button>
      <button class="btn mrg-xl mrg--l row v-center">
        <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
        Share</button>
    </div>

    <Query bind:data />

    <Result {data} {...data} {columns} />
  </main>
</div>

<style>
  main {
    padding: 24px 16px;
    background: var(--athens);
    min-height: 100vh;
    flex: 1;
  }

  button {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
