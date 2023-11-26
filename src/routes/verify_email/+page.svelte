<script lang="ts">
  import { goto } from '$app/navigation'
  import { mutate } from 'webkit/api'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { notifications$ } from 'webkit/ui/Notifications'

  export let data: import('./$types').PageData

  const { currentUser$ } = getCurrentUser$Ctx()

  if (process.browser) {
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
        const currentUser = $currentUser$
        const { user } = emailChangeVerify as any

        if (currentUser && user?.email) {
          currentUser.email = user?.email
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
