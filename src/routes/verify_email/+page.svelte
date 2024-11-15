<script lang="ts">
  import { goto } from '$app/navigation'
  import { BROWSER } from 'esm-env'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import { mutate } from 'san-webkit/lib/api'
  import { notifications$ } from 'san-webkit/lib/ui/Notifications'

  export let data: import('./$types').PageData

  const { currentUser } = useCustomerCtx()

  if (BROWSER) {
    const { emailCandidate, token } = data

    mutate(
      `mutation emailChangeVerify($emailCandidate: String!, $token: String!) {
    emailChangeVerify(emailCandidate: $emailCandidate, token: $token) {
      token
      user {
        email
      }
    }
  }`,
      { variables: { emailCandidate, token } },
    )
      .then(({ emailChangeVerify }) => {
        const { user } = emailChangeVerify as any

        if (currentUser.$$ && user?.email) {
          currentUser.$$.email = user?.email
        }

        return notifications$.show({
          type: 'success',
          title: 'Email changed',
        })
      })
      .finally(() => {
        goto('/')
      })
  }
</script>

<style>
</style>
