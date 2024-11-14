<script lang="ts">
  import Product from 'san-webkit/lib/ui/Product.svelte'
  // import AccountStatus from 'san-webkit/lib/ui/AccountStatus.svelte'
  // import AccountDropdown from 'san-webkit/lib/ui/AccountDropdown/index.svelte'
  import AccountDropdown from 'san-webkit-next/ui/app/AccountDropdown'
  import AccountStatus from 'san-webkit-next/ui/app/AccountStatus'
  import Products from 'san-webkit/lib/ui/Products/svelte'
  import Tooltip from '../Tooltip'
  import { cn } from '../utils'
  import Button from '../Button.svelte'
</script>

<header class="border-b bg-white px-6 py-4">
  <nav class="flex gap-2 fill-green text-waterloo">
    <Product title="Queries" class="mr-4 items-center gap-2 text-base font-medium"></Product>

    <Products
      active="sanbase"
      class="!mr-5 flex items-center"
      dropdownClassName="shadow gap-6"
      isColumn
      isCompact
    />

    <Button href="https://santiment.net/discord" variant="ghost" icon="discord">Community</Button>
    <Button href="/explorer" variant="ghost" icon="fire-filled" class="fill-green">Explorer</Button>

    <Tooltip class="p-2">
      {#snippet children({ trigger, trigger$, isOpened })}
        <Button
          {...trigger}
          action={trigger$}
          variant="ghost"
          icon="plus-circle-filled"
          class={cn('mr-auto bg-green-light-1', isOpened && 'bg-athens text-green')}>Create</Button
        >
      {/snippet}

      {#snippet tooltip()}
        <Button
          variant="ghost"
          href="/query/new"
          icon="query"
          iconSize="12"
          class="hover:fill-green">New query</Button
        >

        <Button
          variant="ghost"
          href="/dashboard-next/edit/new"
          icon="dashboard"
          iconSize="12"
          class="hover:fill-green"
        >
          New dashboard
        </Button>
      {/snippet}
    </Tooltip>

    <Button href="https://academy.santiment.net/" variant="ghost">Academy</Button>
    <Button href="https://app.santiment.net/pricing" variant="ghost">Pricing</Button>

    <div class="mx-4 h-8 border-l border-porcelain"></div>

    <section class="items-center gap-3 whitespace-nowrap row">
      <AccountStatus />

      <AccountDropdown version={process.env.VERSION || '2.5'}></AccountDropdown>
    </section>
  </nav>
</header>

<style>
  header :global {
    .btn-ghost {
      @apply rounded-md px-1.5 py-2 text-black hover:bg-athens hover:text-green;
    }

    .tooltip {
      @apply bg-white;
    }

    .toggle {
      fill: var(--fill);
    }

    .btn--orange {
      --bg: var(--orange);
      --accent: var(--orange);
      --border: var(--orange);
      --accent-hover: var(--orange-hover);
      --border-hover: var(--orange-hover);
    }

    .pro.btn-1 {
      @apply px-3 py-1.5;
    }

    .logout {
      @apply fill-waterloo hover:fill-red-hover hover:text-red-hover;
      justify-content: initial;
    }

    .img.row {
      @apply bg-athens fill-waterloo;
    }
  }
</style>
