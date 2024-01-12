<script lang="ts">
  import { getCustomer$Ctx } from 'webkit/stores/customer'
  import Gdpr from 'webkit/ui/LoginPrompt/Gdpr.svelte'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()

  $: currentUser = $currentUser$ as App.CurrentUser | null

  function onAccept(username: string) {
    const currentUser = $currentUser$
    if (currentUser) {
      currentUser.username = username
      currentUser$.set(currentUser)
    }

    customer$.refetch()
    goto('/')
  }
</script>

{#if !currentUser || currentUser?.privacyPolicyAccepted || $page.url.pathname === '/privacy-policy'}
  <slot />
{:else}
  <gdpr class="row hv-center">
    <Gdpr currentUser={$currentUser$} {onAccept} />
  </gdpr>
{/if}

<style>
  .row {
    flex: 1;
  }

  .row::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background: url('/login-bg.svg') no-repeat 50% / contain;
  }
</style>
