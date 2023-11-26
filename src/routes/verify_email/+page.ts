import type { PageLoad } from './$types'

import { redirect } from '@sveltejs/kit'

export const ssr = false

export const load: PageLoad = async ({ parent, url: { searchParams } }) => {
  const { session } = await parent()
  const { currentUser } = session

  if (!currentUser) throw redirect(307, '/')
  if (!process.browser) return

  return {
    emailCandidate: searchParams.get('emailCandidate') as string,
    token: searchParams.get('token') as string,
  }
}
