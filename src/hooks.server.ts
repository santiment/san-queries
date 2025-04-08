import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit'

import { Device } from 'san-webkit/lib/responsive'
import { sequence } from '@sveltejs/kit/hooks'

import {
  appSessionHandle,
  sanbaseVersionHandle,
  cookiePolicyHandle,
  amplitudeTrackHandle,
  posthogTrackHandle,
} from 'san-webkit-next/sveltekit/hooks'
import { DeviceType } from 'san-webkit-next/ctx/device'

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

const appHandle: Handle = async ({ event, resolve }) => {
  event.locals.device = DeviceType.Desktop
  event.locals.customer = undefined
  event.locals.theme = ''

  return resolve(event)
}

export const handle = sequence(
  posthogTrackHandle,
  amplitudeTrackHandle,
  appSessionHandle,
  //appHandle,
  //cookiePolicyHandle,
  //sanbaseVersionHandle,
)

export const handleError: HandleServerError = ({ error }: any) => {
  const { message } = error as Error
  console.error(error)

  if ((message || '').startsWith('Not found:')) {
    throw redirect(302, '/query/new')
    // throw redirect(302, '/query/new')
  }

  return error
}
