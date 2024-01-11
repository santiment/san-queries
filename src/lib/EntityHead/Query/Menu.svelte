<script lang="ts">
  import { goto } from '$app/navigation'
  import { mutateDeleteSqlQuery } from '$lib/api/query/delete'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import { EventQueryDeleted$ } from '$routes/(editor)/query/events'
  import { track } from 'san-webkit/lib/analytics'
  import { getContext } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip'

  const { queryEditor$ } = getQueryEditor$Ctx()

  const quickSave = getContext('quickSave')

  let TooltipNode: Tooltip

  function onButtonClick() {
    track.event('query_editor_menu_open', {
      category: 'Interaction',

      source_url: window.location.href,
    })
  }

  function onSaveClick() {
    quickSave?.(true)

    track.event('query_editor_menu_save_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })
  }

  function onDeleteClick() {
    const { query } = $queryEditor$
    TooltipNode?.close()

    track.event('query_editor_menu_delete_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    if (!query?.id) return

    const isConfirmed = confirm(`Delete this query?
This action can't be undone`)
    if (!isConfirmed) return

    EventQueryDeleted$.dispatch(query)
  }

  const eventQueryDeleted = EventQueryDeleted$(onQueryDeleted)
  $eventQueryDeleted

  function onQueryDeleted({ id }: { id: number }) {
    mutateDeleteSqlQuery(id)

    const selectedQuery = $queryEditor$.query

    if (selectedQuery?.id === id) {
      goto('/query/new')
    }
  }
</script>

<Tooltip bind:this={TooltipNode} on="click" let:trigger clickaway position="bottom-end">
  <button use:trigger class="btn-3" on:click={onButtonClick}
    ><Svg id="vert-dots" w="3" h="16" /></button
  >

  <menu slot="tooltip" class="column">
    <button class="btn-ghost" on:click={onSaveClick}>Save</button>
    <button class="btn-ghost" on:click={onDeleteClick}>Delete</button>
  </menu>
</Tooltip>

<style>
  menu {
    padding: 8px;
  }
</style>
