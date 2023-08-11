import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
  const { currentUser, customer, theme, device, isCookiesVisible } = locals

  return {
    currentUser,
    customer,
    theme,
    device,
    isCookiesVisible,
  }
}
