<script lang="ts">
  import { BROWSER } from 'esm-env'
</script>

<section class="flex-1 column">
  {#if BROWSER}
    <h1 class="data-heading">test</h1>
    <!-- Browser Content -->
  {:else}
    <!-- SSR Content -->
  {/if}
</section>

<style lang="postcss">
  section > :global(article) {
    display: contents;
  }
  section :global {
    @nested-import './main.css';

    @nested-import './headings.css';

    @nested-import './list.css';

    @nested-import './columns.css';
  }
</style>
