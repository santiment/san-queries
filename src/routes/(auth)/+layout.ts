import type { LayoutLoad } from './$types'

import { redirect } from '@sveltejs/kit'

export const load: LayoutLoad = async ({ parent, url }) => {
  const { session } = await parent()
  const { customer } = session

  if (customer.currentUser) throw redirect(307, '/query/new')
}
