import { redirect } from '@sveltejs/kit'

export const load = async ({ url }) => {
  throw redirect(302, `/query/new${url.search}`)
}
