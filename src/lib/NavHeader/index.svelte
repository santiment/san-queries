<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Product from 'webkit/ui/Product.svelte'
  import AccountStatus from 'webkit/ui/AccountStatus.svelte'
  import AccountDropdown from 'webkit/ui/AccountDropdown/index.svelte'

  const { currentUser$ } = getCurrentUser$Ctx()
  $: currentUser = $currentUser$

  function onLogoutClick() {}
</script>

<header class="row v-center gap-s">
  <Product title="Queries" class="mrg-l mrg--r" />

  <a href="/" class="btn-ghost"><Svg id="discord" w="16" h="12" /> Community</a>
  <a href="/" class="btn-ghost"><Svg id="fire-filled" w="11" h="14" /> Explorer</a>

  <Tooltip position="bottom-start" activeClass="$style.active" let:trigger>
    <button use:trigger class="btn-ghost"><Svg id="plus-circle-filled" w="16" /> Create</button>
    <tooltip slot="tooltip" class="column">
      <a href="/query/new" class="action btn-ghost"><Svg id="query" w="12" /> New query</a>
      <a href="/dashboard/new" class="action btn-ghost">
        <Svg id="dashboard" w="12" /> New dashboard
      </a>
    </tooltip>
  </Tooltip>

  <a href="/" class="btn-ghost mrg-a mrg--l">Academy</a>
  <a href="/" class="btn-ghost">Pricing</a>

  <div class="br mrg-l mrg--l mrg--r" />

  <AccountStatus {currentUser} />
  <AccountDropdown {currentUser} {onLogoutClick} version={process.env.VERSION || '2.0'} />
</header>

<style lang="scss">
  header {
    border-bottom: 1px solid var(--porcelain);
    padding: 16px 24px;
  }

  .btn-ghost {
    display: flex;
    align-items: center;
    gap: 8px;
    --fill: var(--green);
    --fill-hover: var(--green);
    --color: var(--waterloo);
    --color-hover: var(--green);
    --bg-hover: var(--athens);
  }

  .active {
    --fill: var(--green);
    color: var(--green);
    --bg: var(--athens);
  }

  .br {
    width: 1px;
    height: 32px;
    background: var(--porcelain);
  }

  tooltip {
    padding: 8px;
    fill: var(--black);
  }

  .action {
    --fill: var(--black);
    --fill-hover: var(--green);
    --color: var(--black);
  }
</style>
