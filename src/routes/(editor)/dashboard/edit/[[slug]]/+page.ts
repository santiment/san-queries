import { BROWSER } from 'esm-env'
import { redirect } from '@sveltejs/kit'
import { loadPageDashboard } from '../../utils.js'

export const ssr = false

export async function load(event) {
  const { session } = await event.parent()
  const { customer } = session

  if (!customer?.currentUser) {
    throw redirect(302, '/')
  }

  const { slug = 'new' } = event.params

  if (slug === 'new') {
    // NOTE: Enforce `/new` page. This will trigger `#key` block in `+page.svelte`
    // Otherwise it doesn't work in some cases, e.g.
    // 1) `/new` opened; 2) entity created and replaceState used; 3) trying to open `/new`
    return { forced: BROWSER ? Date.now() : undefined }
  }

  const [apiDashboard, dashboardDataCache] = await loadPageDashboard(event)

  if (!apiDashboard) {
    throw redirect(302, '/dashboard/edit/new')
  }

  if (+apiDashboard.user.id !== +customer?.currentUser.id) {
    throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
    dashboardDataCache,
  }
}
