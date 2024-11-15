<script lang="ts">
  import { getCustomer$Ctx } from 'san-webkit/lib/stores/customer'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  // import { LoginType } from 'san-webkit/lib/analytics/events/general'
  import { goto } from '$app/navigation'
  import { mutateVerifyEmail } from './api'
  import { BROWSER } from 'esm-env'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  // import { tick } from 'svelte'
  // import { trackSignupLogin } from '$lib/utils/analytics'
  // import PageLoader from '$lib/PageLoader.svelte'

  export let data: import('./$types').PageData

  const { customer } = useCustomerCtx()

  if (BROWSER) {
    const { email, token, successRedirect } = data

    mutateVerifyEmail(email as string, token as string)
      .then((currentUser) => {
        customer.reload().then(() => {
          goto(successRedirect)
        })

        // trackSignupLogin(currentUser.firstLogin, LoginType.EMAIL)
      })
      .catch(() => {
        goto('/')
      })
  }
</script>

<!-- <PageLoader /> -->
