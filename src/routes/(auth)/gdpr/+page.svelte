<script lang="ts">
  import { goto } from '$app/navigation'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { getCustomer$Ctx } from 'webkit/stores/customer'
  import Gdpr from 'webkit/ui/LoginPrompt/Gdpr.svelte'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()

  function onAccept(username: string) {
    const currentUser = $currentUser$
    if (currentUser) {
      currentUser.username = username
      currentUser$.set(currentUser)
    }

    customer$.refetch()
    goto('/query/new')
  }
</script>

<svelte:head>
  <title>GDPR - Santiment Queries</title>
</svelte:head>

<Gdpr title="Welcome to Queries" currentUser={$currentUser$} {onAccept} />
