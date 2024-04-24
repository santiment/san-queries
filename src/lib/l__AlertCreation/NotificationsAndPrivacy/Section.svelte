<script lang="ts">
  export let title: string
</script>

<section class="mrg-l mrg--b border">
  <h4 class="caption txt-m c-waterloo">{title}</h4>

  <slot />
</section>

<style lang="postcss">
  h4 {
    background: var(--athens);
    padding: 8px 16px;

    :global(~ .row),
    :global(~ .column) {
      border-top: 1px solid var(--porcelain);
      padding: 14px 16px;
    }
  }
</style>
