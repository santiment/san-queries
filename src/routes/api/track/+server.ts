import type { RequestHandler } from './$types'

import { error, json } from '@sveltejs/kit'

const AMPLITUDE_URL = 'https://api2.amplitude.com/2/httpapi'
const MAX_EVENTS = 100

// Only these go to Amplitude. Never forward the inbound headers: they carry the visitor's session
// Cookie / Authorization for *.santiment.net.
export const POST: RequestHandler = async (event) => {
  let body: any

  try {
    body = await event.request.json()
  } catch {
    error(400, 'Invalid JSON')
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !Array.isArray(body.events) ||
    body.events.length > MAX_EVENTS
  ) {
    error(400, 'Invalid payload')
  }

  const res = await fetch(AMPLITUDE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    body: JSON.stringify(body),
    redirect: 'error',
  })

  const data = await res.json().catch(() => ({}))

  return json(data, { status: res.status })
}
