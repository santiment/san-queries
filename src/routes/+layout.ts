import type { LayoutLoad } from './$types'

import '../setup'
import { redirect } from '@sveltejs/kit'
import { setupKitClientSession } from 'webkit/utils/kit'

export const load: LayoutLoad = (event) => {
  const { data } = event

  setupKitClientSession(data)

  if (!data.currentUser) {
    if (event.route.id?.startsWith('/(editor)/') && event.url.pathname.includes('/new')) {
      throw redirect(302, '/sign-up')
    }
  }

  return {
    session: data,
  }
}
