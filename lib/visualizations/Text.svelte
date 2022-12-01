<script lang="ts">export let data;
export let columns;
export let column;
export let placeholder = '';

$: targetColumn = column || columns[0];</script>

{#if data.length}
  <div class="column hv-center">
    <h2 class="h3">
      {#if targetColumn}
        {targetColumn.format(data[data.length - 1] || [])}
      {:else}
        {placeholder}
      {/if}
    </h2>
  </div>
{/if}

<style>
  div {
    flex: 1;
  }
</style>
