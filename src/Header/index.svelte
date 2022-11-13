<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { currentUser as currentUser$ } from 'studio/stores/user'
  import { getAppContext } from '@/context'
  import CreationInfo from './CreationInfo.svelte'
  // import Comments from './Comments.svelte'
  import { showShareDialog } from '@/ShareDialog.svelte'
  import SaveButton from './SaveButton.svelte'
  // import { mutateComputeRawClickhouseQuery } from '@/api/rawQuery'
  import { getParametersMap } from '@/utils/parameters'
  import { shareColumn } from '@/utils/columns'
  import NewPanelButton from './NewPanelButton.svelte'

  const { dashboard$ } = getAppContext()

  // export let columns
  // export let data
  // export let panel: SAN.Queries.Panel
  // export let error = ''
  export let selectedPanel

  let isCommentsShowed = false

  $: dashboard = $dashboard$
  $: currentUser = $currentUser$

  $: ({ user } = dashboard)
  $: isAuthor = currentUser && user && +user.id === +currentUser.id

  /*
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
*/

  function onShare() {
    let link = window.location.href + '?shared='
    const { name, sql, settings } = dashboard.panels[0]
    const { type, columns, xAxisKey, layout } = settings

    link += encodeURIComponent(
      JSON.stringify({
        name,
        sql: { ...sql, parameters: getParametersMap(sql.parameters) },
        settings: {
          type,
          xAxisKey,
          layout: layout?.slice(0, 4),
          columns: columns.map(shareColumn),
          parameters: sql.parameters.map(({ type }) => ({ type })),
        },
      }),
    )

    showShareDialog({ title: 'Share dashboard', data: { link } })
  }
</script>

<div class="header row border v-center mrg-l mrg--b">
  {#if selectedPanel}
    <div class="row body-2 v-center">
      <button class="link btn-0 body-1 txt-m mrg-s mrg--r" on:click={() => (selectedPanel = null)}>
        <Svg id="pointer" w="14" h="10" class="$style.pointer" />

        {dashboard.title || 'Unsaved dashboard'}
      </button>
      / {selectedPanel.name}
    </div>
  {:else}
    <CreationInfo
      {currentUser}
      {dashboard}
      {isAuthor}
      onCommentsClick={() => (isCommentsShowed = !isCommentsShowed)} />
  {/if}

  <!-- <Comments bind:isCommentsShowed /> -->

  <NewPanelButton />

  <SaveButton class="$style.action" {user} {isAuthor} />

  <button class="btn mrg-xl mrg--l row v-center" on:click={onShare}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  .header {
    padding: 16px;
  }

  button,
  .action {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }

  .link {
    --color: var(--black);
  }

  .pointer {
    transform: rotate(180deg);
    margin: -3px 8px 0 0;
  }
</style>
