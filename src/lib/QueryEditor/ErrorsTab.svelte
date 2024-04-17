<script lang="ts">
  let { errors }: { errors: { date: string; details: string; old: boolean }[] } = $props()

  function read(_node: HTMLElement, error: any) {
    error.old = true
  }
</script>

<div class="flex flex-1 flex-col overflow-auto text-xs">
  {#each errors as error}
    <error class="mb-3 flex items-start gap-2">
      {#if !error.old}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label use:read={error} class="mt-[-1px] rounded bg-green px-1.5 py-0.5 text-white"
          >NEW</label
        >
      {/if}
      <date class="text-waterloo">[{error.date}]</date>

      <pre class="whitespace-pre-wrap">{error.details.trim()}</pre>
    </error>
  {:else}
    No errors
  {/each}
</div>
