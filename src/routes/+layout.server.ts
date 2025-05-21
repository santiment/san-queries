import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
  const {
    customer,
    theme,
    device,
    isCookiesVisible,

    old_customer,
    old_currentUser,
    old_device,
  } = locals

  return {
    customer,
    theme,
    device,
    isCookiesVisible,

    old_customer,
    old_currentUser,
    old_device,
  }
}
