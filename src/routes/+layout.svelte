<script lang="ts">
  // import '../app.css'
  import './app.css'
  import 'san-webkit-next/app.css'

  import { BROWSER } from 'esm-env'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import { useUiCtx } from 'san-webkit-next/ctx/ui'
  import { useDeviceCtx } from 'san-webkit-next/ctx/device'
  import { useAssetsCtx } from 'san-webkit-next/ctx/assets'
  import NextNotifications from 'san-webkit-next/ui/core/Notifications'
  import { BootFlag } from 'san-webkit-next/utils'

  import Dialogs from 'san-webkit/lib/ui/Dialog/Dialogs.svelte'
  import Notifications from 'san-webkit/lib/ui/Notifications'
  import FeatureWalkthrough from 'san-webkit/lib/ui/FeatureWalkthrough/svelte'
  import NavHeader from '$lib/ui/NavHeader'
  import Gdpr from '$lib/Gdpr.svelte'
  import Tracking from './Tracking.svelte'
  import OnlyOnDevice from 'san-webkit-next/ui/utils/OnlyOnDevice'
  import Meta from './Meta.svelte'
  import Legacy from './Legacy.svelte'

  // export let data: LayoutData
  let { data } = $props()

  useCustomerCtx(data.session.customer)
  useUiCtx()
  useDeviceCtx(data.session.device)
  useAssetsCtx()

  $effect(() => {
    BootFlag.set()
  })
</script>

<Meta />

<Legacy {data}>
  <OnlyOnDevice desktop>
    <NavHeader />
  </OnlyOnDevice>

  <Gdpr>
    <slot />
  </Gdpr>

  {#if BROWSER}
    <Dialogs />
    <FeatureWalkthrough />
    <Notifications />

    <Tracking />

    <NextNotifications></NextNotifications>
  {/if}
</Legacy>

<style lang="postcss">
  :root {
    --accent: var(--green);
    --accent-hover: var(--green-hover);
  }

  :global {
    html {
      scroll-behavior: smooth;
    }

    body {
      @apply flex min-h-[100vh] flex-col;
    }
  }
</style>
