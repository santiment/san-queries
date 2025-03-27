<script lang="ts">
  import type { CurrentUserType } from 'san-webkit/lib/stores/user'

  import { BROWSER } from 'esm-env'
  import { updateAmplitude } from 'san-webkit/lib/analytics/amplitude'
  import { startLinksListener } from 'san-webkit/lib/analytics/links'
  import { parseAuthSearchParams } from 'san-webkit/lib/utils/auth'
  import { trackSignupLogin } from '$lib/utils/analytics'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import { usePageViewEventTracking } from 'san-webkit-next/analytics'

  const { currentUser } = useCustomerCtx()

  if (BROWSER) {
    usePageViewEventTracking()
    startLinksListener()

    setTimeout(() => {
      trackAuth(currentUser.$$)
    }, 1000)
  }

  function setupAmplitude(user: CurrentUserType | null) {
    if (!user) return

    const { id, username, email } = user

    updateAmplitude(id, username, email)
  }

  function trackAuth(user: CurrentUserType | null) {
    if (!user) return
    const { auth, signup } = parseAuthSearchParams() as any

    if (auth) {
      trackSignupLogin(user.firstLogin || !!signup, auth as any)

      history.replaceState('/', history.state, window.location.pathname)
    }
  }
</script>
