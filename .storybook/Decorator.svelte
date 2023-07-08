<script lang="ts">
  import { Device } from 'webkit/responsive'
  import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
  import { UI$$ } from 'webkit/stores/ui'
  import { CurrentUser$$ } from 'webkit/stores/user'
  import { Customer$$ } from 'webkit/stores/customer'
  import { Device$$, getDeviceInfo } from 'webkit/stores/responsive'

  export let currentUser: null | SAN.CurrentUser
  export let customer: undefined | SAN.Customer
  // export let device

  CurrentUser$$(currentUser)
  Customer$$(customer)
  UI$$()
  const { device$ } = Device$$(getDeviceInfo(Device.Desktop))
</script>

<svelte:window on:resize={device$.onResize} />

<slot />

<Dialogs />

<style>
</style>
