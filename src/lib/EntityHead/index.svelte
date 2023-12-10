<script lang="ts">
  import { noop } from 'webkit/utils'
  import Svg from 'webkit/ui/Svg/svelte'
  import Profile from 'webkit/ui/Profile/svelte'
  import { EventSavingState$ } from '$routes/(editor)/query/events'

  let className = 'mrg-s mrg--b'
  export { className as class }
  export let author: SAN.Author | null
  export let onMainClick = noop

  let mainActionClass = 'main-action btn-1 mrg-l mrg--l'

  let savingState = 'hidden' as 'start' | 'success' | 'error' | 'hidden'
  let stateTimer: number

  const eventSavingState = EventSavingState$(({ state }) => {
    window.clearTimeout(stateTimer)

    savingState = state

    switch (state) {
      case 'success':
        stateTimer = window.setTimeout(() => (savingState = 'hidden'), 4e3)
    }
  })
  $eventSavingState
</script>

<header class="row v-center gap-m {className}">
  {#if author}
    <Profile user={author} source="queries_head" feature="query" />
  {:else}
    Your first query
  {/if}

  <div class="divider" />

  <slot />

  <auto-save class="row v-center c-waterloo gap-s mrg-a mrg--l">
    {#if savingState !== 'hidden'}
      {#if savingState === 'start'}
        Saving <loading-spin />
      {:else if savingState === 'success'}
        Saved <Svg id="checkmark" w="12" />
      {/if}
    {/if}
  </auto-save>

  <slot name="main-action-wrap" classes={mainActionClass}>
    <button class={mainActionClass} on:click={onMainClick}>
      <slot name="main-action" />
    </button>
  </slot>

  <actions class="row v-center gap-s mrg-xs mrg--l">
    <slot name="actions" />
  </actions>
</header>

<style>
  header {
    padding: 24px 0 16px;
  }

  .divider {
    height: 32px;
    width: 1px;
    background: var(--mystic);
  }

  Svg {
    fill: var(--casper);
  }
</style>
