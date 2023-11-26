import type { LayoutLoad } from './$types'

import { redirect } from '@sveltejs/kit'
// import { checkIsGdprPage } from './flow'

export const load: LayoutLoad = async ({ parent, url }) => {
  // if (checkIsGdprPage(url)) return

  const { session } = await parent()
  const { currentUser } = session

  if (currentUser) throw redirect(307, '/query/new')
}
