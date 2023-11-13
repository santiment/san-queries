<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './new/ctx'
  import { mutateCreateSqlQuery } from '$lib/api/query/create'

  import { getSavedJson, saveJson } from 'webkit/utils/localStorage'

  export let apiQuery = null as null | App.ApiQuery
  export let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(apiQuery, defaultSql)

  $: console.log($queryEditor$)

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      const { name, description, query, sql, parameters } = $queryEditor$

      if (!name) {
        notifications$.show({
          type: 'error',
          title: 'Untitled query can not be saved',
          dismissAfter: 5000,
        })

        return
      }

      mutateCreateSqlQuery({
        name,
        description,
        sql,
        isPublic: true,
        parameters,
      }).then((apiQuery) => {
        console.log(apiQuery)
        queryEditor$.setApiQuery(apiQuery)

        saveJson('__QUERIES', [...getSavedJson<any>('__QUERIES', []), apiQuery])

        window.history.replaceState('', history.state, '/query/' + apiQuery.id)

        notifications$.show({
          type: 'success',
          title: query?.id ? 'Query saved' : 'New query created',
          description: 'Query is available in "Work" tab',
          dismissAfter: 5000,
        })
      })
    },
    false,
  )
  $saveShortcut
</script>

<main class="column">
  <QueryHead author={$currentUser$} />

  <slot />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
  }
</style>
