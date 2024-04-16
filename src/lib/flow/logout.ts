import { setSessionValue } from 'san-webkit/lib/stores/utils'
import { notifications$ } from 'san-webkit/lib/ui/Notifications'
import { mutate } from 'san-webkit/lib/api'

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
