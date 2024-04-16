<script>
  import LoginPrompt from 'san-webkit/lib/ui/LoginPrompt/index.svelte'
  import { page } from '$app/stores'
  import { getAuthCtx } from '../ctx'

  const { onMetamaskClick } = getAuthCtx()

  const successRedirect = $page.url.searchParams.get('from') ?? ''
</script>

<LoginPrompt title="Welcome back" {onMetamaskClick} from={successRedirect} />
