import type { RequestHandler } from './$types'

import { json } from '@sveltejs/kit'

export const POST: RequestHandler = async (event) => {
  const headers = event.request.headers
  headers.delete('Content-Length')

  headers.set('host', 'api2.amplitude.com')

  const body = await event.request.json()

  const res = await fetch('https://api2.amplitude.com/2/httpapi', {
    method: 'POST',
    headers,
    body: JSON.stringify(body), //: event.request.body,
  })

  const data = await res.json()

  return json(data)
}
