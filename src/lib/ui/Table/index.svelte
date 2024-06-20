<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<table class="relative w-full border-spacing-0 text-left">
  {@render children()}
</table>

<style lang="postcss">
  :global {
    .cell-auto {
      max-width: 0;
      width: 100%;
    }

    .cell-min {
      width: 1px;
    }

    .cell-sticky {
      position: sticky;
      left: 0;
    }

    .cell-visible {
      overflow: visible !important;
    }
  }

  table :global {
    th,
    td {
      white-space: nowrap;
    }

    th {
      font-weight: 500;
      padding: 5px 15px;
      color: var(--casper);
      background: var(--athens);
      border-bottom: 1px solid var(--porcelain);
    }

    td {
      padding: 8px 15px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    tbody tr:hover td {
      background: var(--athens);
    }
  }
</style>
