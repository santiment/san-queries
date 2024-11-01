import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
  const { customer, theme, device, isCookiesVisible } = locals

  return {
    customer,
    theme,
    device,
    isCookiesVisible,
  }
}
