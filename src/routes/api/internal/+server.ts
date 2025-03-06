import type { RequestHandler } from './$types'
import { GQL_BASIC_AUTH_USERNAME, GQL_BASIC_AUTH_PASSWORD } from '$env/static/private';

import { BROWSER } from 'esm-env';
import { error, json } from '@sveltejs/kit'

const ENDPOINT = ((!BROWSER && process.env.NODE_GQL_SERVER_URL) ||
    process.env.GQL_SERVER_URL);

export const POST: RequestHandler = async (event) => {
  const { headers, body } = event.request

  headers.delete('content-length')

  if (GQL_BASIC_AUTH_USERNAME && GQL_BASIC_AUTH_PASSWORD) {
    headers.set('Authorization', `Basic ${btoa(`${GQL_BASIC_AUTH_USERNAME}:${GQL_BASIC_AUTH_PASSWORD}`)}`)
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
};
