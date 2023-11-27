import type { LayoutLoad } from './$types'

import '../setup'
import { redirect } from '@sveltejs/kit'
import { handleGdprAccess } from './(auth)/flow'

let hasBooted = false

function setupKitClientSession<T>(data: T) {
  if (process.browser) {
    if (hasBooted) {
      Object.assign(window.__SESSION__, data)
    } else {
      window.__SESSION__ = data || {}
      hasBooted = true
    }
  }
}

export const load: LayoutLoad = (event) => {
  const { data } = event

  setupKitClientSession(data)

  handleGdprAccess(data.currentUser, event.url)

  if (!data.currentUser) {
    if (event.route.id?.startsWith('/(editor)/')) {
      throw redirect(302, '/sign-up')
    }
  }

  return {
    session: data,
  }
}
