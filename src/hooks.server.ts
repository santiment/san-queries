import type { Handle, HandleServerError } from '@sveltejs/kit'

import { redirect } from '@sveltejs/kit'
import UAParser from 'ua-parser-js'
import { Device } from 'san-webkit/lib/responsive'
import { getDeviceInfo } from 'san-webkit/lib/stores/responsive'
import { queryCustomer } from 'san-webkit/lib/stores/customer'
import { COOKIE_POLICY_ACCEPTED } from 'san-webkit/lib/ui/ManageCookiesDialog/index.svelte'
import { queryCurrentUser } from '$lib/api/user'
import { UniQuery } from '$lib/api'

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

export const handle: Handle = async ({ event, resolve }) => {
  const customerPromise = queryCustomer(event)

  const currentUser = await queryCurrentUser(UniQuery(event.fetch))().catch(() => {
    console.log('currentUser query error')
    return null
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

export const handleError: HandleServerError = ({ error }: any) => {
  const { message } = error as Error
  console.error(error)

  if ((message || '').startsWith('Not found:')) {
    throw redirect(302, '/query/new')
  }

  return error
}
