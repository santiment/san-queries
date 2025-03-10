import type { RequestHandler } from './$types'

import { error, json } from '@sveltejs/kit'

const GQL_BASIC_AUTH_USERNAME = process.env.GQL_BASIC_AUTH_USERNAME
const GQL_BASIC_AUTH_PASSWORD = process.env.GQL_BASIC_AUTH_PASSWORD
const ENDPOINT = process.env.NODE_GQL_SERVER_URL || process.env.GQL_SERVER_URL

export const POST: RequestHandler = async (event) => {
  const { headers, body } = event.request

  headers.delete('content-length')

  if (GQL_BASIC_AUTH_USERNAME && GQL_BASIC_AUTH_PASSWORD) {
    headers.set(
      'Authorization',
      `Basic ${btoa(`${GQL_BASIC_AUTH_USERNAME}:${GQL_BASIC_AUTH_PASSWORD}`)}`,
    )
  }

  try {
    // @ts-expect-error
    const response = await fetch(ENDPOINT, { method: 'POST', duplex: 'half', headers, body })

    const data = await response.json()
    return json(data, { status: response.status })
  } catch (e) {
    console.error(e)
    return error(500, 'Internal server error')
  }
}
