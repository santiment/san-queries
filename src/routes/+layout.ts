import type { LayoutLoad } from './$types'

import { redirect } from '@sveltejs/kit'
import { BROWSER } from 'esm-env'
import { isTrackingEnabled } from 'san-webkit/lib/analytics'
import { initAmplitude } from 'san-webkit/lib/analytics/amplitude'
import { initGA } from 'san-webkit/lib/analytics/ga'
import { trackAppClose, trackAppOpen } from 'san-webkit/lib/analytics/events/general'
import { setupKitClientSession } from 'san-webkit/lib/utils/kit'

if (BROWSER) {
  if (process.env.IS_PROD_MODE && process.env.IS_PROD_BACKEND) {
    if (isTrackingEnabled) {
      initAmplitude({
        id: '4176ada51d1e856a580c681a23c2cd6c',
        scriptSrc: '/webkit/static/amp-1.5.js',
        serverUrl: '/api/track',
      })

      initGA('G-H53MB0V33X')
    }

    // bootIntercom('cyjjko9u')
  }

  trackAppOpen()
  window.addEventListener('beforeunload', () => {
    trackAppClose()
  })
}

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
