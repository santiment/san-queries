<script>
  import LoginPrompt from 'webkit/ui/LoginPrompt/index.svelte'
  import { getAuthCtx } from '../ctx'

  const { onMetamaskClick } = getAuthCtx()
</script>

<LoginPrompt title="Welcome back" {onMetamaskClick} />
