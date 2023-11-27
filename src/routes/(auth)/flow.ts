import { redirect } from '@sveltejs/kit'

export const checkIsGdprPage = (url: URL) => url.pathname === '/gdpr'

export function handleGdprAccess(currentUser: null | SAN.CurrentUser, url: URL) {
  const isGdprPage = checkIsGdprPage(url)

  if (currentUser) {
    if (currentUser.privacyPolicyAccepted) {
      if (isGdprPage) throw redirect(302, '/')
    } else {
      if (url.pathname === '/privacy-policy') return
      if (!isGdprPage) throw redirect(307, '/gdpr')
    }
  } else if (isGdprPage) {
    throw redirect(307, '/sign-up')
  }
}
