import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { UniQuery } from '$lib/api/index'
import { queryGetDashboard } from './api'
import { gotoDashboardPage } from './utils'

export const ssr = false

export const load = async (event) => {
  const { slug = 'new' } = event.params

  if (slug === 'new') return

  const dashboardId = getIdFromSEOLink(slug)

  if (Number.isInteger(dashboardId) === false) {
    throw redirect(302, '/dashboard/new')
  }

  const preloaded = gotoDashboardPage.get()
  const apiDashboard =
    preloaded?.apiDashboard === undefined
      ? await queryGetDashboard(UniQuery(event.fetch))(dashboardId).catch(() => null)
      : preloaded.apiDashboard

  if (!apiDashboard) {
    throw redirect(302, '/dashboard/new')
  }

  return {
    apiDashboard,
  }
}
