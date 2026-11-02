import type { RequestHandler } from './$types'

import { error, json } from '@sveltejs/kit'

const ENDPOINT = process.env.NODE_GQL_SERVER_URL || process.env.GQL_SERVER_URL

export const POST: RequestHandler = async (event) => {
  return error(404, 'Route not found')
}
