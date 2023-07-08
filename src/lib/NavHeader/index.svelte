<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'

  export let testArg = null

  const { currentUser$ } = getCurrentUser$Ctx()
  $: console.log($currentUser$)
</script>

<header>123</header>

<style lang="scss">
  @include dac(desktop) {
    header {
      background: red;
    }
  }
</style>
