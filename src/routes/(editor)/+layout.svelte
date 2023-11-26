<script lang="ts">
  import type { LayoutData } from './$types'

  import OnlyOnDevice from 'webkit/ui/OnlyOnDevice.svelte'
  import LeftMenu from '$lib/LeftMenu/index.svelte'
  import { Workspace$$ } from '$lib/LeftMenu/Work/ctx'

  Workspace$$()
</script>

<OnlyOnDevice desktop>
  <LeftMenu />
</OnlyOnDevice>

<slot />
