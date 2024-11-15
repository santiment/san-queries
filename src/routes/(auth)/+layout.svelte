<script lang="ts">
  import { setAuthCtx, startEthLoginFlow } from './ctx'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { customer } = useCustomerCtx()

  function onMetamaskClick() {
    return startEthLoginFlow().then(() => {
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
