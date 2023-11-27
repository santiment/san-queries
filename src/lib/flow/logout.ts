import { setSessionValue } from 'webkit/stores/utils'
import { notifications$ } from 'webkit/ui/Notifications'
import { goto } from '$app/navigation'

import { mutate } from 'webkit/api'

const mutateLogout = () =>
  mutate(`mutation {
    logout {
      success
    }
  }`)

export function startLogoutFlow(currentUser$: SAN.CurrentUserStore, customer$: SAN.CustomerStore) {
  mutateLogout()

  currentUser$.set(null)
  setSessionValue({ currentUser: null })

  customer$.clear()
  customer$.resetToDefault()

  notifications$.show({
    type: 'info',
    title: "You've been logged out",
  })
}
