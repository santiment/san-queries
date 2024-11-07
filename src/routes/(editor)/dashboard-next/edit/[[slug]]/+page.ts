import { redirect } from '@sveltejs/kit'
import { loadPageDashboard } from '../../utils.js'

export async function load(event) {
  const { session } = await event.parent()
  const { customer } = session

  if (!customer.currentUser) {
    throw redirect(302, '/')
  }

  const { slug = 'new' } = event.params

  if (slug === 'new') {
    return {}
  }

  const [apiDashboard, dashboardDataCache] = await loadPageDashboard(event)

  if (!apiDashboard) {
    throw redirect(302, '/dashboard/edit/new')
  }

  if (+apiDashboard.user.id !== +customer.currentUser.id) {
    throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
    dashboardDataCache,
  }
}
