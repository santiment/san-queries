import { Tracker } from 'san-webkit/lib/analytics'
import { LoginType, PageType, trackAuthFinish, trackLoginFinish } from 'san-webkit/lib/analytics/events/general'
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

export function getPageType(pathname: string) {
  if (pathname.startsWith('/query')) return 'query'

  if (pathname.startsWith('/dashboard')) return 'dashboard'

  if (pathname.startsWith('/explorer')) return 'queries_explorer'

  if (pathname.startsWith('/login')) return PageType.Login

  if (pathname.startsWith('/sign-up')) return PageType.SignUp
}