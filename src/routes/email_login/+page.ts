import { BROWSER } from 'esm-env'
import type { PageLoad } from './$types'

import { redirect } from '@sveltejs/kit'
import { getSafeRedirectPath } from '$lib-next/utils/safe-redirect'

export const ssr = false

export const load: PageLoad = async ({ parent, url: { searchParams } }) => {
  const { session } = await parent()
  const { currentUser } = session

  if (currentUser) throw redirect(307, '/')
  if (!BROWSER) return

  // const weekleNewsletter = searchParams.get('subscribe_to_weekly_newsletter')

  // const data = await mutateVerifyEmail(email, token)
  // currentUser.set(data)
  // customerData$.refetch()

  const successRedirect = getSafeRedirectPath(searchParams.get('success_redirect_url'))

  return {
    email: searchParams.get('email') as string,
    token: searchParams.get('token') as string,
    successRedirect,
  }
}
