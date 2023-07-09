<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Product from 'webkit/ui/Product.svelte'
  import AccountStatus from 'webkit/ui/AccountStatus.svelte'
  import AccountDropdown from 'webkit/ui/AccountDropdown/index.svelte'

  const { currentUser$ } = getCurrentUser$Ctx()
  $: currentUser = $currentUser$

  function onLogoutClick() {}
</script>

<header class="row v-center gap-s">
  <Product title="Queries" class="test" />

  <a href="/" class="btn-ghost"
    >Community
    <span />
  </a>
  <a href="/" class="btn-ghost">Explorer</a>
  <a href="/" class="btn-ghost">Create</a>

  <a href="/" class="btn-ghost mrg-a mrg--l">Academy</a>
  <a href="/" class="btn-ghost">Pricing</a>

  <div class="br mrg-l mrg--l mrg--r" />

  <AccountStatus currentUser={null} />
  <AccountDropdown currentUser={null} {onLogoutClick} version={process.env.VERSION || '2.0'} />
</header>

<style lang="scss">
  header {
    border-bottom: 1px solid var(--porcelain);
    padding: 16px 24px;
  }

  a {
    gap: 8px;
    fill: var(--green);
    --color: var(--waterloo);
    --color-hover: var(--green);
    --bg-hover: var(--athens);
  }

  .br {
    width: 1px;
    height: 32px;
    background: var(--porcelain);
  }
</style>
