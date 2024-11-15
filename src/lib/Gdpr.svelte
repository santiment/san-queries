<script lang="ts">
  import Gdpr from 'san-webkit/lib/ui/LoginPrompt/Gdpr.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { currentUser, customer } = useCustomerCtx()

  function onAccept(username: string) {
    customer.reload()
    goto('/')
  }
</script>

{#if !currentUser.$$ || currentUser.$$?.privacyPolicyAccepted || $page.url.pathname === '/privacy-policy'}
  <slot />
{:else}
  <gdpr class="hv-center row">
    <Gdpr currentUser={currentUser.$$} {onAccept} />
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
