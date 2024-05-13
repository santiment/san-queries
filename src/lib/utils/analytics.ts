import { Tracker } from 'san-webkit/lib/analytics'
import { trackAuthFinish, trackLoginFinish } from 'san-webkit/lib/analytics/events/general'
import { trackSignupFinish } from 'san-webkit/lib/analytics/events/onboarding'

export function trackSignupLogin(isFirstLogin: boolean, method: LoginType) {
  if (window.authMethod) return

  window.authMethod = method

  trackAuthFinish(method, isFirstLogin)

  if (isFirstLogin) {
    trackSignupFinish(method, [Tracker.GA, Tracker.AMPLITUDE])

    window.onGdprAccept = () => trackSignupFinish(method, [Tracker.SAN])
  } else {
    trackLoginFinish(method)
  }
}
