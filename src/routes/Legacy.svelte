<script lang="ts">
  import { Customer$$ } from 'san-webkit/lib/stores/customer'
  import { CurrentUser$$ } from 'san-webkit/lib/stores/user'
  import { Device$$ } from 'san-webkit/lib/stores/responsive'
  import { newAppTooltipsCtx } from 'san-webkit/lib/ui/Tooltip/ctx'
  import { UI$$ } from 'san-webkit/lib/stores/ui'

  let { data } = $props()

  newAppTooltipsCtx()
  CurrentUser$$(data.session.old_currentUser)
  Customer$$(data.session.old_customer || {})
  UI$$()
  const { device$ } = Device$$(data.session.old_device)
</script>

<svelte:window on:resize={device$.onResize} />

<slot></slot>
