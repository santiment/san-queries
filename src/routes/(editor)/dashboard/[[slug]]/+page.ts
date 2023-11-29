import type { PageLoad } from '../../$types'

import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'webkit/utils/url'
import { queryGetDashboard, queryGetLegacyDashboard } from '$lib/api/dashboard/get'

export const load: PageLoad = async (event) => {
  const { slug } = event.params

  if (slug === 'new') return

  const id = getIdFromSEOLink(slug)
  if (Number.isInteger(id) === false) {
    throw redirect(302, '/dashboard/new')
  }

  const apiDashboard = await queryGetDashboard(id, event as App.RequestEvent)

  const isLegacyMigrateMode = !!event.url.searchParams.get('legacy-migrate')

  let legacyDashboard

  if (process.browser) {
    if (apiDashboard.panels.length) {
      legacyDashboard = await queryGetLegacyDashboard(id)
    }
  }

  console.log({ legacyDashboard, apiDashboard }, isLegacyMigrateMode)

  if (legacyDashboard && isLegacyMigrateMode === false) {
    const dashboardLayout = []

    const queries = legacyDashboard.panels.map((panel) => {
      const { layout } = panel.settings || {}
      dashboardLayout.push({ id: panel.id, xywh: layout || [] })

      return {
        id: panel.id,
        name: panel.name,
        dashboardQueryMappingId: panel.id,
        settings: {},
        sqlQueryParameters: panel.sql.parameters || {},
        sqlQueryText: panel.sql.query,
      }
    })

    apiDashboard.settings = { layout: dashboardLayout }
    apiDashboard.queries = queries

    console.log(dashboardLayout, queries)
  }

  return {
    apiDashboard,
    legacyDashboard: isLegacyMigrateMode ? legacyDashboard : undefined,
  }
}
