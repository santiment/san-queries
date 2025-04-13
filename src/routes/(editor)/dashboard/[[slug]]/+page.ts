//import type { EasyGenerator } from './$types'

import { redirect } from '@sveltejs/kit'
import { loadPageDashboard } from '../utils.js'

//export const entries: EasyGenerator = () => {
//  return [{ slug: 'dyor-of-a-token-sentiment-social-data-and-context-1153' }]
//}
//export const prerender = true

//export const ssr = false

export async function load(event) {
  // const { session } = await event.parent()
  // const { customer } = session

  const { slug = 'new' } = event.params

  if (slug === 'new') {
    throw redirect(302, '/dashboard/edit/new')
  }

  const [apiDashboard, dashboardDataCache] = await loadPageDashboard(event)

  if (!apiDashboard) {
    throw redirect(302, '/dashboard/edit/new')
  }

  return {
    apiDashboard,
    dashboardDataCache,

    meta: {
      title: `${apiDashboard.name} - Santiment Dashboard`,
    },
  }
}
