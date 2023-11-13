import { queryGetSqlQuery } from '$lib/api/query/get'
import type { PageLoad } from '../../$types'

import { getIdFromSEOLink } from 'webkit/utils/url'

export const load: PageLoad = async (event) => {
  const { slug } = event.params

  const queryId = getIdFromSEOLink(slug)

  const apiQuery = await queryGetSqlQuery(queryId, event as App.RequestEvent)

  return {
    apiQuery,
  }
}
