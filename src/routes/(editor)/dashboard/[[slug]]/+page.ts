import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { UniQuery } from '$lib/api/index.js'
import { queryGetDashboard } from './api.js'

export const ssr = false

export const load = async (event) => {
  const { slug = 'new' } = event.params

  if (slug === 'new') return

  const dashboardId = getIdFromSEOLink(slug)

  if (Number.isInteger(dashboardId) === false) {
    throw redirect(302, '/dashboard/new')
  }

  const apiDashboard = await queryGetDashboard(UniQuery(event.fetch))(dashboardId)

  return {
    apiDashboard,
  }
}
