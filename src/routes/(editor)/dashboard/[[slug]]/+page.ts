import type { PageLoad } from '../../$types'

import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'webkit/utils/url'
import { queryGetDashboard } from '$lib/api/dashboard/get'

export const load: PageLoad = async (event) => {
  const { slug } = event.params

  if (slug === 'new') return

  const id = getIdFromSEOLink(slug)
  if (Number.isInteger(id) === false) {
    throw redirect(302, '/dashboard/new')
  }

  const apiDashboard = await queryGetDashboard(id, event as App.RequestEvent)

  return {
    apiDashboard,
  }
}