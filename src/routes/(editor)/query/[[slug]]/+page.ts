import { redirect } from '@sveltejs/kit'
import { BROWSER } from 'esm-env'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { UniQuery } from '$lib/api/index.js'
import { queryGetSqlQuery } from './api'
import { gotoQueryPage } from './utils'

export const ssr = false

export const load = async (event) => {
  const { slug = 'new' } = event.params

  if (slug === 'new') {
    // NOTE: Enforce `/new` page. This will trigger `#key` block in `+page.svelte`
    // Otherwise it doesn't work in some cases, e.g.
    // 1) `/new` opened; 2) entity created and replaceState used; 3) trying to open `/new`
    return { forced: BROWSER ? Date.now() : undefined }
  }

  const queryId = getIdFromSEOLink(slug)

  if (Number.isInteger(queryId) === false) {
    throw redirect(302, '/query/new')
  }

  const preloaded = gotoQueryPage.get()
  const apiQuery =
    preloaded?.apiQuery === undefined
      ? await queryGetSqlQuery(UniQuery(event.fetch))(queryId).catch(() => null)
      : preloaded?.apiQuery

  if (!apiQuery) {
    throw redirect(302, '/query/new')
  }

  return {
    apiQuery,
  }
}
