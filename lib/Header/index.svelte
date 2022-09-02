<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { currentUser as currentUser$ } from 'san-studio/lib/stores/user';
import { getAppContext } from './../../lib/context';
import ExecuteButton from './../../lib/Query/ExecuteButton.svelte'; // import CreationInfo from './CreationInfo.svelte'
// import Comments from './Comments.svelte'

import { showShareDialog } from './../../lib/ShareDialog.svelte';
import SaveButton from './SaveButton.svelte';
import { mutateComputeRawClickhouseQuery } from './../../lib/api/rawQuery';
import { getParametersMap } from './../../lib/utils/parameters';
import { shareColumn } from './../../lib/utils/columns';
const {
  dashboard$
} = getAppContext(); // export let columns

export let data;
export let panel;
export let error = ''; // let isCommentsShowed = false

$: dashboard = $dashboard$;

$: currentUser = $currentUser$;

$: ({
  user
} = dashboard);

$: isAuthor = currentUser && user && +user.id === +currentUser.id;

function onExecuteClick(resolve) {
  const {
    query,
    parameters
  } = panel.sql;
  return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters)).then(sqlResult => {
    data = sqlResult;
    error = '';
    resolve();
  });
}

function onQueryError(msg) {
  error = msg;
}

function onShare() {
  let link = window.location.href + '?shared=';
  const {
    name,
    sql,
    settings
  } = dashboard.panels[0];
  const {
    type,
    columns,
    xAxisKey
  } = settings;
  link += JSON.stringify({
    name,
    sql: Object.assign(Object.assign({}, sql), {
      parameters: getParametersMap(sql.parameters)
    }),
    settings: {
      type,
      xAxisKey,
      columns: columns.map(shareColumn),
      parameters: sql.parameters.map(({
        type
      }) => ({
        type
      }))
    }
  });
  showShareDialog({
    title: 'Share dashboard',
    data: {
      link
    }
  });
}</script>

<div class="row v-center mrg-m mrg--b">
  <ExecuteButton onClick={onExecuteClick} onError={onQueryError} />

  <!-- 
  <CreationInfo
    {currentUser}
    {dashboard}
    {columns}
    {isAuthor}
    onCommentsClick={() => (isCommentsShowed = !isCommentsShowed)} />

  <Comments bind:isCommentsShowed />
 -->

  <SaveButton class="action-4jOd5E" {user} {isAuthor} />

  <button class="btn mrg-xl mrg--l row v-center" on:click={onShare}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  button,
  :global(.action-4jOd5E) {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
