import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
// import { UniQuery } from '$lib/api/index'
import { queryGetDashboard } from './api'
import { gotoDashboardPage } from './utils'
import { UniQuery } from 'san-webkit-next/api/executor.js'

// export const ssr = false

export const load = async (event) => {
  const { slug = '' } = event.params

  const dashboardId = getIdFromSEOLink(slug)

  if (Number.isInteger(dashboardId) === false) {
    // throw redirect(302, '/dashboard/edit/new')
  }

  // const preloaded = gotoDashboardPage.get()
  const apiDashboard = await queryGetDashboard(UniQuery(event.fetch))(dashboardId).catch(() => null)

  if (!apiDashboard) {
    // throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
  }
}
