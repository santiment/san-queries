<script lang="ts">
  import type { CurrentUserType } from 'san-webkit/lib/stores/user'

  import { BROWSER } from 'esm-env'
  import { updateAmplitude } from 'san-webkit/lib/analytics/amplitude'
  import { startLinksListener } from 'san-webkit/lib/analytics/links'
  import { trackPageView } from 'san-webkit/lib/analytics/events/general'
  import { parseAuthSearchParams } from 'san-webkit/lib/utils/auth'
  import { page } from '$app/stores'
  import { getPageType, trackSignupLogin } from '$lib/utils/analytics'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { currentUser } = useCustomerCtx()

  let source = ''
  let sourceSearchParams = ''

  if (BROWSER) {
    startLinksListener()
    page.subscribe(({ url }) => trackPageChange(url))

    setTimeout(() => {
      trackAuth(currentUser.$$)
    }, 1000)
  }

  function setupAmplitude(user: CurrentUserType | null) {
    if (!user) return

    const { id, username, email } = user

    updateAmplitude(id, username, email)
  }

  function trackPageChange(url: URL) {
    const path = url.pathname
    const searchParams = '?' + url.searchParams.toString()

    if (source !== path) {
      trackPageView({
        url: path,
        type: getPageType(path),
        searchParams,

        sourceUrl: source,
        sourceType: getPageType(source),
        sourceSearchParams,
      } as any)
    }

    source = path
    sourceSearchParams = searchParams.toString()
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
