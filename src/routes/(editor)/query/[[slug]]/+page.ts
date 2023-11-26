import type { PageLoad } from '../../$types'

import { queryGetSqlQuery } from '$lib/api/query/get'
import { redirect } from '@sveltejs/kit'

import { getIdFromSEOLink } from 'webkit/utils/url'

export const load: PageLoad = async (event) => {
  const { slug } = event.params

  if (slug === 'new') return

  const queryId = getIdFromSEOLink(slug)
  if (Number.isInteger(queryId) === false) {
    throw redirect(302, '/query/new')
  }

  const apiQuery = await queryGetSqlQuery(queryId, event as App.RequestEvent)

  return {
    apiQuery,
  }
}
