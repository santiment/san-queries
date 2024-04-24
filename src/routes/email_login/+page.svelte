<script lang="ts">
  import { getCustomer$Ctx } from 'san-webkit/lib/stores/customer'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  // import { LoginType } from 'san-webkit/lib/analytics/events/general'
  import { goto } from '$app/navigation'
  import { mutateVerifyEmail } from './api'
  // import { tick } from 'svelte'
  // import { trackSignupLogin } from '$lib/utils/analytics'
  // import PageLoader from '$lib/PageLoader.svelte'

  export let data: import('./$types').PageData

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()

  if (process.browser) {
    const { email, token, successRedirect } = data

    mutateVerifyEmail(email as string, token as string)
      .then((currentUser) => {
        currentUser$.set(currentUser)
        customer$.refetch()

        goto(successRedirect)

        // trackSignupLogin(currentUser.firstLogin, LoginType.EMAIL)
      })
      .catch(() => {
        goto('/')
      })
  }
</script>

<!-- <PageLoader /> -->
