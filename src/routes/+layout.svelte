<script lang="ts">
  import type { LayoutData } from './$types'

  import { Customer$$ } from 'webkit/stores/customer'
  import { CurrentUser$$ } from 'webkit/stores/user'
  import { Device$$ } from 'webkit/stores/responsive'
  import { UI$$ } from 'webkit/stores/ui'
  import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
  import Notifications from 'webkit/ui/Notifications'
  import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
  import OnlyOnDevice from 'webkit/ui/OnlyOnDevice.svelte'
  import NavHeader from '$lib/NavHeader/index.svelte'
  import LeftMenu from '$lib/LeftMenu/index.svelte'
  import { Workspace$$ } from '$lib/LeftMenu/Work/ctx'

  export let data: LayoutData

  CurrentUser$$(data.session.currentUser)
  Customer$$(data.session.customer)
  UI$$()
  const { device$ } = Device$$(data.session.device)
  Workspace$$()
</script>

<svelte:window on:resize={device$.onResize} />

<OnlyOnDevice desktop>
  <NavHeader />
</OnlyOnDevice>

<screen class="row">
  <OnlyOnDevice desktop>
    <LeftMenu />
  </OnlyOnDevice>

  <slot />
</screen>

{#if process.browser}
  <Dialogs />
  <FeatureWalkthrough />
  <Notifications />
{/if}

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

  screen {
    flex: 1;
  }

  @include dac(tablet, phone, phone-xs) {
    padding-bottom: 83px;
  }
</style>
