import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { UniQuery } from '$lib/api/index.js'
import { queryGetSqlQuery } from './api.js'

export const ssr = false

export const load = async (event) => {
  const { slug = 'new' } = event.params

  if (slug === 'new') return

  const queryId = getIdFromSEOLink(slug)

  if (Number.isInteger(queryId) === false) {
    throw redirect(302, '/query/new')
  }

  const apiQuery = await queryGetSqlQuery(UniQuery(event.fetch))(queryId)

  return {
    apiQuery,
  }
}
