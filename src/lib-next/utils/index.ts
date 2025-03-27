import { page } from '$app/state'

const TARGET_ID = '1153'
export function checkIsDyorDashboard() {
  if (!page.route.id?.includes('/dashboard/')) return false

  if (!page.params.slug?.endsWith(TARGET_ID)) return false

  return true
}
