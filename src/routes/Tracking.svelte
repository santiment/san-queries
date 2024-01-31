<script lang="ts">
  import type { CurrentUserType } from 'webkit/stores/user'

  import { BROWSER } from 'esm-env'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { updateAmplitude } from 'webkit/analytics/amplitude'
  import { startLinksListener } from 'webkit/analytics/links'
  import { trackPageView } from 'webkit/analytics/events/general'
  import { page } from '$app/stores'

  const { currentUser$ } = getCurrentUser$Ctx()

  let source = ''
  let sourceSearchParams = ''

  if (BROWSER) {
    startLinksListener()
    currentUser$.subscribe(setupAmplitude)
    page.subscribe(({ url }) => trackPageChange(url))
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
        searchParams,

        sourceUrl: source,
        sourceSearchParams,
      } as any)
    }

    source = path
    sourceSearchParams = searchParams.toString()
  }
</script>
