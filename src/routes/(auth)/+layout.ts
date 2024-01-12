import type { LayoutLoad } from './$types'

import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = async ({ parent, url }) => {
  const { session } = await parent()
  const { currentUser } = session

  if (currentUser) throw redirect(307, '/query/new')
}
