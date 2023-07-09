<script lang="ts">
  import type { LayoutData } from './$types'

  import { Device } from 'webkit/responsive'
  import { Customer$$ } from 'webkit/stores/customer'
  import { CurrentUser$$ } from 'webkit/stores/user'
  import { Device$$, getDeviceInfo } from 'webkit/stores/responsive'
  import { UI$$ } from 'webkit/stores/ui'

  export let data: LayoutData

  CurrentUser$$()
  Customer$$()
  UI$$()
  const { device$ } = Device$$(getDeviceInfo(Device.Desktop))
</script>

<svelte:window on:resize={device$.onResize} />

<slot />

<style lang="scss">
  :root {
    --accent: var(--green);
    --accent-hover: var(--green-hover);
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  /* TODO: Is it needed? [@vanguard | 10 Jan, 2023] */
  :global(body) {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  @include dac(tablet, phone, phone-xs) {
    padding-bottom: 83px;
  }
</style>
