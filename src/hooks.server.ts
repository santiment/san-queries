import type { HandleServerError } from '@sveltejs/kit'

import { redirect } from '@sveltejs/kit'
import { Device } from 'san-webkit/lib/responsive'
import { sequence } from '@sveltejs/kit/hooks'

import {
  appSessionHandle,
  sanbaseVersionHandle,
  cookiePolicyHandle,
  amplitudeTrackHandle,
} from 'san-webkit-next/sveltekit/hooks'

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

export const handle = sequence(
  amplitudeTrackHandle,
  appSessionHandle,
  cookiePolicyHandle,
  sanbaseVersionHandle,
)

export const handleError: HandleServerError = ({ error }: any) => {
  const { message } = error as Error
  console.error(error)

  if ((message || '').startsWith('Not found:')) {
    throw redirect(302, '/query/new')
  }

  return error
}
