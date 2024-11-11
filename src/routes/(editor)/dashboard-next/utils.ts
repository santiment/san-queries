import { redirect, type LoadEvent } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { queryGetDashboard } from '$lib-next/features/Dashboard/api'
import { UniQuery } from 'san-webkit-next/api/executor.js'
import { queryGetCachedDashboardQueriesExecutions } from '$lib/Dashboard/flow/sqlData/api'

export async function loadPageDashboard(event: LoadEvent<{ slug?: string }>) {
  const dashboardId = event.params.slug ? getIdFromSEOLink(event.params.slug) : undefined

  if (Number.isInteger(dashboardId) === false) {
    throw redirect(302, '/dashboard/edit/new')
  }

  const executor = UniQuery(event.fetch)
  return Promise.all([
    queryGetDashboard(executor)(dashboardId!),
    queryGetCachedDashboardQueriesExecutions(executor)(dashboardId!).catch(() => null),
  ])
}