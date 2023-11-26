<script lang="ts">
  import { getCustomer$Ctx } from 'webkit/stores/customer'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  // import { LoginType } from 'webkit/analytics/events/general'
  import { goto } from '$app/navigation'
  import { mutateVerifyEmail } from './api'
  // import { trackSignupLogin } from '$lib/utils/analytics'
  // import PageLoader from '$lib/PageLoader.svelte'

  export let data: import('./$types').PageData

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()

  if (process.browser) {
    const { email, token } = data

    mutateVerifyEmail(email as string, token as string)
      .then((currentUser) => {
        currentUser$.set(currentUser)
        customer$.refetch()

        goto(currentUser.privacyPolicyAccepted ? '/' : '/gdpr')

        // trackSignupLogin(currentUser.firstLogin, LoginType.EMAIL)
      })
      .catch(() => {
        goto('/')
      })
  }
</script>

<!-- <PageLoader /> -->
