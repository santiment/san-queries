<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'

  const { currentUser$ } = getCurrentUser$Ctx()
  $: console.log($currentUser$)
</script>

<header>123</header>

<style>
</style>
