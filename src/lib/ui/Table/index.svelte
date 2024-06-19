<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<table class="relative w-full border-spacing-0 text-left">
  {@render children()}
</table>

<style lang="postcss">
  :global {
    :global(.cell-auto) {
      max-width: 0;
      width: 100%;
    }

    :global(.cell-min) {
      width: 1px;
    }

    :global(.cell-sticky) {
      position: sticky;
      left: 0;
    }

    :global(.cell-visible) {
      overflow: visible !important;
    }

    :global(table) {
      :global(th),
      :global(td) {
        white-space: nowrap;
      }

      :global(th) {
        font-weight: 500;
        padding: 5px 15px;
        color: var(--casper);
        background: var(--athens);
        border-bottom: 1px solid var(--porcelain);
      }

      :global(td) {
        padding: 8px 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :global(tbody tr:hover td) {
        background: var(--athens);
      }
    }
  }
</style>
