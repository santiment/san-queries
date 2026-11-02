import type { RequestHandler } from './$types'
import { env } from '$env/dynamic/private'

import { error, json } from '@sveltejs/kit'
import { findAllowedQuery } from './allowed-queries'

const ENDPOINT = (process.env.NODE_GQL_SERVER_URL || process.env.GQL_SERVER_URL) as string

// Sanbase still sees the visitor: X-Forwarded-For feeds its request log and per-IP call
// limits (without it every request comes from this pod's cluster IP, which has none),
// and Origin picks the product. Nothing else is passed on, cookies included.
const FORWARDED_HEADERS = ['origin', 'user-agent', 'x-forwarded-for']

// Runs the dashboard widgets' queries with Sanbase's basic-auth credential, so restricted
// metrics render for every visitor. That credential reads everything, hence the allowlist.
export const POST: RequestHandler = async ({ request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    error(400, 'Bad request')
  }

  const { query: text, variables = null } = (body ?? {}) as { query?: unknown; variables?: unknown }

  const query = typeof text === 'string' ? findAllowedQuery(text) : undefined
  if (!query) error(400, 'Query not allowed')

  if (variables !== null && (typeof variables !== 'object' || Array.isArray(variables))) {
    error(400, 'Bad request')
  }

  const headers = new Headers({ 'Content-Type': 'application/json' })
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  // Read at runtime from the pod's environment (Vault), never baked into the image.
  const { GRAPHQL_BASIC_AUTH_USERNAME: username, GRAPHQL_BASIC_AUTH_PASSWORD: password } = env
  if (username && password) {
    headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`)
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })

    const data = await response.json()
    return json(data, { status: response.status })
  } catch (e) {
    console.error(e)
    return error(500, 'Internal server error')
  }
}
