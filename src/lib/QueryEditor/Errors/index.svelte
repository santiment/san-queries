<script lang="ts">
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'

  const { queryEditor$ } = getQueryEditor$Ctx()

  $: queryEditor = $queryEditor$
  $: ({ sqlErrors } = queryEditor)

  function read(_node: HTMLElement, error: any) {
    error.old = true
  }
</script>

<main class="caption">
  {#each sqlErrors as error}
    <error class="row gap-s mrg-m mrg--b">
      {#if !error.old}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label use:read={error}>NEW</label>
      {/if}
      <date class="c-waterloo">[{error.date}]</date>

      <pre>{error.details.trim()}</pre>
    </error>
  {/each}
</main>

<style>
  main {
    background: var(--white);
    border-radius: 6px;
    flex: 1;
    padding: 16px 24px;
    min-height: 0;
    overflow: auto;
  }

  error {
    font-family: monospace;
    align-items: flex-start;
  }

  label {
    font: var(--caption);
    background: var(--green);
    color: var(--white);
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: -1px;
  }

  pre {
    white-space: pre-wrap;
  }
</style>
