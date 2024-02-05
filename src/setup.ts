import './client'
import 'webkit/styles/main.css'
import { BROWSER } from 'esm-env'
import { isTrackingEnabled } from 'webkit/analytics'
import { initAmplitude } from 'webkit/analytics/amplitude'
import { bootIntercom } from 'webkit/analytics/intercom'
import { initGA } from 'webkit/analytics/ga'
import { trackAppOpen, trackAppClose } from 'webkit/analytics/events/general'

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

    bootIntercom('cyjjko9u')
  }

  trackAppOpen()
  window.addEventListener('beforeunload', () => {
    trackAppClose()
  })
}
