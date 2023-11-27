import { getContext, setContext } from 'svelte'
import { goto } from '$app/navigation'
import { notifications$ } from 'webkit/ui/Notifications'
import { ethLoginMutation } from 'webkit/api/login'
import { CURRENT_USER_FRAGMENT } from 'san-webkit/lib/stores/user'

const CTX = 'authCtx'

export function setAuthCtx(onMetamaskClick: () => unknown) {
  return setContext(CTX, { onMetamaskClick })
}

export type ICurrentUserCtx = ReturnType<typeof setAuthCtx>

export const getAuthCtx = () => getContext(CTX) as ICurrentUserCtx

export function startEthLoginFlow(currentUser$: SAN.CurrentUserStore) {
  return ethLoginMutation(CURRENT_USER_FRAGMENT)
    .then(({ ethLogin }: any) => {
      const { user } = ethLogin

      currentUser$.set(user)

      notifications$.show({
        type: 'success',
        title: 'You are logged in!',
      })

      goto('/query/new')

      // trackSignupLogin(user.firstLogin, LoginType.METAMASK)

      return user
    })
    .catch((e) => {
      console.error(e)
      return Promise.reject(e)
    })
}
