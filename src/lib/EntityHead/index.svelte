<script lang="ts">
  import { noop } from 'webkit/utils'
  import Profile from 'webkit/ui/Profile/svelte'

  let className = 'mrg-s mrg--b'
  export { className as class }
  export let author: SAN.Author | null
  export let onMainClick = noop
</script>

<header class="row v-center gap-m {className}">
  {#if author}
    <Profile user={author} source="queries_head" feature="query" />
  {:else}
    Your first query
  {/if}

  <div class="divider" />

  <slot />

  <button class="main-action btn-1 mrg-a mrg--l" on:click={onMainClick}>
    <slot name="main-action" />
  </button>

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
</style>
