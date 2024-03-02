<script>
  import LoginPrompt from 'webkit/ui/LoginPrompt/index.svelte'
  import { getAuthCtx } from '../ctx'
  import { page } from '$app/stores'

  const { onMetamaskClick } = getAuthCtx()

  const successRedirect = $page.url.searchParams.get('from') ?? ''
</script>

<LoginPrompt
  title="Welcome to Queries"
  isSignUp
  bottomLabel="Have an account?"
  bottomAction="Log in"
  bottomHref="/login"
  from={successRedirect}
  {onMetamaskClick}
/>
