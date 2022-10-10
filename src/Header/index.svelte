<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { currentUser as currentUser$ } from 'studio/stores/user'
  import { getAppContext } from '@/context'
  import CreationInfo from './CreationInfo.svelte'
  // import Comments from './Comments.svelte'
  import { showShareDialog } from '@/ShareDialog.svelte'
  import SaveButton from './SaveButton.svelte'
  import { mutateComputeRawClickhouseQuery } from '@/api/rawQuery'
  import { getParametersMap } from '@/utils/parameters'
  import { shareColumn } from '@/utils/columns'

  const { dashboard$ } = getAppContext()

  // export let columns
  export let data
  export let panel: SAN.Queries.Panel
  export let error = ''
  export let selectedPanel

  let isCommentsShowed = false

  $: dashboard = $dashboard$
  $: currentUser = $currentUser$

  $: ({ user } = dashboard)
  $: isAuthor = currentUser && user && +user.id === +currentUser.id

  function onExecuteClick(resolve) {
    const { query, parameters } = panel.sql
    return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters)).then(
      (sqlResult) => {
        data = sqlResult
        error = ''
        resolve()
      },
    )
  }

  function onQueryError(msg) {
    error = msg
  }

  function onShare() {
    let link = window.location.href + '?shared='
    const { name, sql, settings } = dashboard.panels[0]
    const { type, columns, xAxisKey } = settings

    link += JSON.stringify({
      name,
      sql: { ...sql, parameters: getParametersMap(sql.parameters) },
      settings: {
        type,
        xAxisKey,
        columns: columns.map(shareColumn),
        parameters: sql.parameters.map(({ type }) => ({ type })),
      },
    })

    showShareDialog({ title: 'Share dashboard', data: { link } })
  }
</script>

<div class="row v-center mrg-m mrg--b">
  {#if selectedPanel}
    <div class="row h4">
      <button
        class="btn-0 mrg-s mrg--r"
        on:click={() => {
          selectedPanel = null
        }}>
        {dashboard.title || 'Unsaved dashboard'} /
      </button>
      {selectedPanel.name}
    </div>
  {:else}
    <CreationInfo
      {currentUser}
      {dashboard}
      {isAuthor}
      onCommentsClick={() => (isCommentsShowed = !isCommentsShowed)} />
  {/if}

  <!-- <Comments bind:isCommentsShowed /> -->

  <SaveButton class="$style.action" {user} {isAuthor} />

  <button class="btn mrg-xl mrg--l row v-center" on:click={onShare}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  button,
  .action {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
