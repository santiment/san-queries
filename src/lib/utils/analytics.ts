import { Tracker } from 'webkit/analytics'
import { LoginType, trackLoginFinish, trackAuthFinish } from 'webkit/analytics/events/general'
import { trackSignupFinish } from 'webkit/analytics/events/onboarding'

export function trackSignupLogin(isFirstLogin: boolean, method: LoginType) {
  if (window.authMethod) return

  window.authMethod = method

  trackAuthFinish(method, isFirstLogin)

  if (isFirstLogin) {
    trackSignupFinish(method, [Tracker.GA, Tracker.AMPLITUDE])
  } else {
    trackLoginFinish(method)
  }
}
