<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { notifications$ } from 'san-webkit/lib/ui/Notifications';
import { currentUser as currentUser$ } from 'san-studio/lib/stores/user';
import { getAppContext } from './../../lib/context';
import CreationInfo from './CreationInfo.svelte'; // import Comments from './Comments.svelte'

import { showShareDialog } from './../../lib/ShareDialog.svelte';
import SaveButton from './SaveButton.svelte'; // import { mutateComputeRawClickhouseQuery } from './../../lib/api/rawQuery'

import { getParametersMap } from './../../lib/utils/parameters';
import { applyPanelData } from './../../lib/utils/columns';
import NewPanelButton from './NewPanelButton.svelte';
import { mutateComputeRawClickhouseQuery } from './../../lib/api/query/raw';
import { showSaveDashboardDialog } from './../../lib/SaveDashboardDialog.svelte';
import { noop } from 'svelte/internal';
import { mutateComputeAndStorePanel } from './../../lib/api/query/store';
import { getQueryString } from './../../lib/sharing/url';
const {
  dashboard$
} = getAppContext(); // export let columns
// export let data
// export let panel: SAN.Queries.Panel
// export let error = ''

export let selectedPanel;
let isCommentsShowed = false;

$: dashboard = $dashboard$;

$: currentUser = $currentUser$;

$: ({
  user
} = dashboard);

$: isAuthor = currentUser && user && +user.id === +currentUser.id;

function onUpdateClick() {
  dashboard.panels.forEach(panel => {
    const {
      id,
      sql
    } = panel;
    const {
      query,
      parameters
    } = sql;

    if (id) {
      mutateComputeAndStorePanel(dashboard.id, id).catch(noop);
    }

    return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters)).then(data => {
      applyPanelData(panel, data);
      dashboard$.set(dashboard);
    }).catch(e => {
      console.log(e);
      notifications$.show({
        title: 'Error during data load',
        type: 'error'
      });
    });
  });
}

function onShare() {
  let link = window.location.href;

  if (!dashboard.id) {
    link += getQueryString(dashboard, selectedPanel);
  }

  showShareDialog({
    title: 'Share dashboard',
    data: {
      link
    }
  });
}

function onBackClick() {
  selectedPanel = null;

  window.__selectSidebarPanel(null);
}</script>

<div class="header row border v-center mrg-l mrg--b">
  {#if selectedPanel}
    <div class="row body-2 v-center mrg-a mrg--r">
      <button class="link btn-0 body-1 txt-m mrg-s mrg--r" on:click={onBackClick}>
        <Svg id="pointer" w="14" h="10" class="pointer-L4tRxv" />

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

    <NewPanelButton />
  {/if}

  <!-- <Comments bind:isCommentsShowed /> -->

  <SaveButton class="action-Yl_q7b" {user} {isAuthor} {selectedPanel} />

  <a
    id="fw-welcome"
    href="https://academy.santiment.net/sql-editor/"
    class="documentation btn row v-center mrg-l mrg--l"
    target="_blank"
    rel="noopener noreferrer">
    <Svg id="description" w="12" h="14" class="mrg-s mrg--r" />
    Documentation
  </a>

  <a
    id="fw-welcome"
    href="https://clickhouse.com/docs/en/sql-reference/"
    class="documentation btn row v-center mrg-l mrg--l"
    target="_blank"
    rel="noopener noreferrer">
    <Svg id="description" w="12" h="14" class="mrg-s mrg--r" />
    SQL Reference
  </a>

  {#if !selectedPanel}
    <button class="action btn mrg-xl mrg--l row v-center " on:click={onUpdateClick}>
      <Svg id="refresh" w="16" class="mrg-s mrg--r" />
      Update
    </button>
  {/if}

  {#if dashboard.id}
    <button
      class="action btn mrg-xl mrg--l row v-center"
      on:click={() =>
        showSaveDashboardDialog({
          title: 'Save dashboard',
          action: 'Save',
          dashboard: { ...dashboard, id: undefined },
        })}>
      <Svg id="copy" w="16" class="mrg-s mrg--r" />
      Duplicate
    </button>
  {/if}

  <button class="btn mrg-xl mrg--l row v-center" on:click={onShare}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  .header {
    padding: 16px;
  }

  button,
  :global(.action-Yl_q7b),
  .documentation {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }

  .link {
    --color: var(--black);
  }

  :global(.pointer-L4tRxv) {
    transform: rotate(180deg);
    margin: -3px 8px 0 0;
  }
</style>
