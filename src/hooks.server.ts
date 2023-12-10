import type { Handle, HandleServerError } from '@sveltejs/kit'

import { redirect } from '@sveltejs/kit'
// import * as Sentry from '@sentry/node'
import UAParser from 'ua-parser-js'
import { Device } from 'webkit/responsive'
import { getDeviceInfo } from 'webkit/stores/responsive'
import { queryCustomer } from 'webkit/stores/customer'
import { COOKIE_POLICY_ACCEPTED } from 'webkit/ui/ManageCookiesDialog/index.svelte'
import { queryCurrentUser } from '$lib/api/user'
// import { initSentry } from '$lib/sentry'

function normalizeDeviceType(type: string | undefined): Device {
  switch (type) {
    case 'mobile':
      return Device.Phone
    case 'tablet':
      return Device.Tablet
    default:
      return Device.Desktop
  }
}

// NOTE: If the `throw redirect()` was called, server hook will be run twice (first time for initial page, second time for redirected one) [@vanguard | 10 Jan, 2023]
export const handle: Handle = async ({ event, resolve }) => {
  const customerPromise = queryCustomer(event)

  const { currentUser } = await queryCurrentUser(event).catch(() => {
    console.log('currentUser query error')
    return {} as { currentUser: null }
  })
  const theme = currentUser?.settings.theme === 'nightmode' ? 'night-mode' : ''

  const userAgent = UAParser(event.request.headers.get('user-agent') as any)
  const device = getDeviceInfo(normalizeDeviceType(userAgent.device.type))

  event.locals.device = device
  event.locals.currentUser = currentUser
  event.locals.customer = await customerPromise
  event.locals.theme = theme
  event.locals.isCookiesVisible = !event.cookies.get(COOKIE_POLICY_ACCEPTED)

  console.log('[SERVER HOOK] ', event.url.pathname)
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%body-class%', `${device.type} ${theme}`),
  })
}

// initSentry(Sentry, process.env.PRODUCTION_SENTRY_DSN || process.env.STAGE_SENTRY_DSN, {
//   is_server: true,
// })

export const handleError: HandleServerError = ({ error }: any) => {
  // Sentry.captureException(error, { extra: { event: normalizeEventError(event) } })

  const { message } = error as Error
  console.error(error)

  if ((message || '').startsWith('Not found:')) {
    throw redirect(302, '/query/new')
  }

  return error
}
