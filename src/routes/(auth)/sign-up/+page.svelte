<script>
  import LoginPrompt from 'webkit/ui/LoginPrompt/index.svelte'
  import { getAuthCtx } from '../ctx'

  const { onMetamaskClick } = getAuthCtx()
</script>

<LoginPrompt
  title="Welcome to Queries"
  isSignUp
  bottomLabel="Have an account?"
  bottomAction="Log in"
  bottomHref="/login"
  {onMetamaskClick}
/>
