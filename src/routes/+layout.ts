import type { LayoutLoad } from './$types'

import { redirect } from '@sveltejs/kit'
import { setupKitClientSession } from 'san-webkit/lib/utils/kit'

export const load: LayoutLoad = (event) => {
  const { data } = event

  setupKitClientSession(data)

  if (!data.currentUser) {
    if (event.route.id?.startsWith('/(editor)/') && event.url.pathname.includes('/new')) {
      // if (event.route.id?.startsWith('/(editor)/')) {
      throw redirect(302, '/sign-up?from=' + encodeURIComponent(event.url.href))
    }
  }

  return {
    session: data,
  }
}
