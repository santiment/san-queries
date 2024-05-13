<script lang="ts">
  import type { LayoutData } from './$types'

  import '../app.css'

  import { BROWSER } from 'esm-env'
  import { Customer$$ } from 'san-webkit/lib/stores/customer'
  import { CurrentUser$$ } from 'san-webkit/lib/stores/user'
  import { Device$$ } from 'san-webkit/lib/stores/responsive'
  import { newAppTooltipsCtx } from 'san-webkit/lib/ui/Tooltip/ctx'
  import { UI$$ } from 'san-webkit/lib/stores/ui'
  import Dialogs from 'san-webkit/lib/ui/Dialog/Dialogs.svelte'
  import Notifications from 'san-webkit/lib/ui/Notifications'
  import FeatureWalkthrough from 'san-webkit/lib/ui/FeatureWalkthrough/svelte'
  import OnlyOnDevice from 'san-webkit/lib/ui/OnlyOnDevice.svelte'
  import NavHeader from '$lib/ui/NavHeader'
  import Gdpr from '$lib/Gdpr.svelte'
  import Tracking from './Tracking.svelte'

  export let data: LayoutData

  newAppTooltipsCtx()
  CurrentUser$$(data.session.currentUser)
  Customer$$(data.session.customer)
  UI$$()
  const { device$ } = Device$$(data.session.device)
</script>

<svelte:head>
  <title>Santiment Queries</title>
</svelte:head>

<svelte:window on:resize={device$.onResize} />

<OnlyOnDevice desktop>
  <NavHeader />
</OnlyOnDevice>

{#if BROWSER}
  <Gdpr>
    <slot />
  </Gdpr>

  <Dialogs />
  <FeatureWalkthrough />
  <Notifications />

  <Tracking />
{/if}

<style lang="postcss">
  :root {
    --accent: var(--green);
    --accent-hover: var(--green-hover);
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    @apply flex min-h-[100vh] flex-col;
  }

  /*
   @include dac(tablet, phone, phone-xs) {
     padding-bottom: 83px;
   }
   */
</style>
