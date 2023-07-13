import type { LayoutLoad } from './$types'

import '../setup'

export const load: LayoutLoad = ({ data }) => {
  if (process.browser) {
    if (!window.__SESSION__) window.__SESSION__ = {}
    Object.assign(window.__SESSION__, data)
  }

  return {
    session: data as any,
  }
}
