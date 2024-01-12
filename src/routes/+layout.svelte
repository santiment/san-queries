<script lang="ts">
  import type { LayoutData } from './$types'

  import { BROWSER } from 'esm-env'
  import { Customer$$ } from 'webkit/stores/customer'
  import { CurrentUser$$ } from 'webkit/stores/user'
  import { Device$$ } from 'webkit/stores/responsive'
  import { newAppTooltipsCtx } from 'webkit/ui/Tooltip/ctx'
  import { UI$$ } from 'webkit/stores/ui'
  import Dialogs from 'webkit/ui/Dialog/Dialogs.svelte'
  import Notifications from 'webkit/ui/Notifications'
  import FeatureWalkthrough from 'webkit/ui/FeatureWalkthrough/svelte'
  import OnlyOnDevice from 'webkit/ui/OnlyOnDevice.svelte'
  import NavHeader from '$lib/NavHeader/index.svelte'
  import Tracking from './Tracking.svelte'
  import Gdpr from '$lib/Gdpr.svelte'

  export let data: LayoutData

  CurrentUser$$(data.session.currentUser)
  Customer$$(data.session.customer)
  UI$$()
  const { device$ } = Device$$(data.session.device)
  newAppTooltipsCtx()
</script>

<svelte:window on:resize={device$.onResize} />

<OnlyOnDevice desktop>
  <NavHeader />
</OnlyOnDevice>

<screen class="row">
  <Gdpr>
    <slot />
  </Gdpr>
</screen>

{#if BROWSER}
  <Dialogs />
  <FeatureWalkthrough />
  <Notifications />

  <Tracking />
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
