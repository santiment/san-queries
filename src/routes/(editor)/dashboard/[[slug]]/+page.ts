import type { PageLoad } from '../../$types'

import { BROWSER } from 'esm-env'
import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'webkit/utils/url'
import { queryGetDashboard, queryGetLegacyDashboard } from '$lib/api/dashboard/get'

export const ssr = false

export const load: PageLoad = async (event) => {
  const { slug } = event.params

  if (slug === 'new') return

  const id = getIdFromSEOLink(slug)
  if (Number.isInteger(id) === false) {
    throw redirect(302, '/dashboard/new')
  }

  const apiDashboard = await queryGetDashboard(id, event as App.RequestEvent)

  if (BROWSER) {
    const isLegacy =
      apiDashboard.panels?.length &&
      !(apiDashboard.queries.length || apiDashboard.textWidgets.length)

    if (isLegacy) {
      apiDashboard.panels = (await queryGetLegacyDashboard(id)).panels
      apiDashboard.isLegacy = true
    }
  }

  if (!apiDashboard.description) {
    apiDashboard.description = ''
  }

  return {
    apiDashboard,
  }
}
