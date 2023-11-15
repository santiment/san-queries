<script lang="ts">
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'

  const { queryEditor$ } = getQueryEditor$Ctx()

  $: queryEditor = $queryEditor$
  $: ({ sqlErrors } = queryEditor)

  function read(_node: HTMLElement, error: any) {
    error.old = true
  }
</script>

<main>
  {#each sqlErrors as error}
    <error class="mrg-m mrg--b">
      {#if !error.old}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label use:read={error}>NEW</label>
      {/if}
      <date class="c-waterloo">[{error.date}]</date>
      {error.details}
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
  }

  error {
    font-family: monospace;
    display: block;
  }

  label {
    font: var(--caption);
    background: var(--green);
    color: var(--white);
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: -3px;
    display: inline-block;
  }
</style>
