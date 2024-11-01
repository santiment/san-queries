<script lang="ts">
  import { getCustomer$Ctx } from 'san-webkit/lib/stores/customer'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { setAuthCtx, startEthLoginFlow } from './ctx'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { customer$ } = getCustomer$Ctx()
  const { customer } = useCustomerCtx()

  function onMetamaskClick() {
    return startEthLoginFlow(currentUser$).then(() => {
      customer$.refetch()
      customer.reload()
    })
  }

  setAuthCtx(onMetamaskClick)
</script>

<auth-page class="hv-center row">
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
