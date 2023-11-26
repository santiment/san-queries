import type { LayoutLoad } from './$types'

import '../setup'
import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = (event) => {
  const { data } = event

  if (process.browser) {
    if (!window.__SESSION__) window.__SESSION__ = {}
    Object.assign(window.__SESSION__, data)
  }

  if (!data.currentUser) {
    if (event.route.id?.startsWith('/(auth)/')) return { session: data }

    throw redirect(302, '/sign-up')
  }

  return {
    session: data,
  }
}
