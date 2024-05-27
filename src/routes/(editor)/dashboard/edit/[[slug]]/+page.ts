import { redirect } from '@sveltejs/kit'
import { getIdFromSEOLink } from 'san-webkit/lib/utils/url'
import { UniQuery } from '$lib/api/index'
import { queryGetDashboard } from '../../[[slug]]/api'
import { gotoDashboardPage } from '../../[[slug]]/utils'

export const ssr = false

export const load = async (event) => {
  const { session } = await event.parent()
  const { currentUser } = session

  if (!currentUser) {
    throw redirect(302, '/dashboard/edit/new')
  }

  const { slug = 'new' } = event.params

  if (slug === 'new') return

  const dashboardId = getIdFromSEOLink(slug)

  if (Number.isInteger(dashboardId) === false) {
    throw redirect(302, '/dashboard/edit/new')
  }

  const preloaded = gotoDashboardPage.get()
  const apiDashboard =
    preloaded?.apiDashboard === undefined
      ? await queryGetDashboard(UniQuery(event.fetch))(dashboardId).catch(() => null)
      : preloaded.apiDashboard

  if (!apiDashboard) {
    throw redirect(302, '/dashboard/edit/new')
  }

  if (+apiDashboard.user.id !== +currentUser.id) {
    throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
  }
}
