import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { BootFlag } from 'san-webkit-next/utils'
import { UniQuery } from 'san-webkit-next/api/executor.js'
import { queryGetCachedDashboardQueriesExecutions } from '$lib/Dashboard/flow/sqlData/api'
import { queryGetDashboard } from './api'
import { gotoDashboardPage } from './utils'

export const ssr = false

async function queryServerDashboardCache(
  executor: ReturnType<typeof UniQuery>,
  dashboardId: number,
) {
  if (BootFlag.get()) {
    return null
  }

  return await queryGetCachedDashboardQueriesExecutions(executor)(dashboardId)
}

export const load = async (event) => {
  const { slug = '' } = event.params

  const dashboardId = getIdFromSEOLink(slug)

  console.log({ dashboardId }, slug)
  if (Number.isInteger(dashboardId) === false) {
    throw redirect(302, '/dashboard/edit/new')
  }

  const executor = UniQuery(event.fetch)

  // const preloaded = gotoDashboardPage.get()
  const [apiDashboard, serverDashboardCache] = await Promise.all([
    queryGetDashboard(executor)(dashboardId).catch((e) => {
      console.error(e)
      return null
    }),

    queryServerDashboardCache(executor, dashboardId),
  ])

  if (!apiDashboard) {
    // throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
    serverDashboardCache,
  }
}
