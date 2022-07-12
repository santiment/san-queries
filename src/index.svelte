<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import Query from './Query.svelte'
  import Result from './Result.svelte'
  import Sidebar from './Sidebar/index.svelte'
  import { Formatter, FormatType } from './Result/Options/Format.svelte'

  let isAuthor = true

  let commentsCount = 3

  let id = 0
  let title = 'My query'
  let user = {
    username: 'Tim_Jones',
  }
  let votes = {}
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

  function onEditClick() {}

  function onVote() {}
</script>

<div class="row">
  <Sidebar />

  <main class="column">
    <div class="row v-center mrg-xl mrg--b">
      <CreationInfo
        fallback="Unsaved dashboard"
        type={CreationType.Layout}
        {id}
        {title}
        {user}
        {votes}
        currentUser={null}
        editLabel={isAuthor ? 'Edit dashboard' : 'Save as'}
        comments={{
          count: commentsCount,
          active: false, // $Sidewidget === SidewidgetType.LAYOUT_COMMENTS,
          onClick: null, // () => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS),
        }}
        {onEditClick}
        {onVote}>
        <svelte:fragment slot="info">123</svelte:fragment>
      </CreationInfo>

      <button class="btn mrg-a mrg--l row v-center">
        <Svg id="copy" w="16" class="mrg-s mrg--r" />
        Duplicate</button>
      <button class="btn mrg-xl mrg--l row v-center">
        <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
        Share</button>
    </div>

    <Query bind:data />

    <Result {...data} {columns} />
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
