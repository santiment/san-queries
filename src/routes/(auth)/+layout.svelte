<script lang="ts">
  import { getCustomer$Ctx } from 'webkit/stores/customer'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  // import { startEthLoginFlow } from '$lib/flow/login'
  // import { setAuthCtx } from './ctx'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()

  function onMetamaskClick() {
    // return startEthLoginFlow(currentUser$).then(() => {
    //   customer$.refetch()
    // })
  }

  // setAuthCtx(onMetamaskClick)
</script>

<auth-page class="row hv-center">
  <slot />
</auth-page>

<style>
  auth-page {
    flex: 1;
  }

  auth-page::before {
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
