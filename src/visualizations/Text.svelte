<script lang="ts">
  export let data
  export let columns
  export let column

  $: targetColumn = column || columns[0]
</script>

<div class="column hv-center">
  <h2 class="h3">
    {#if targetColumn}
      {@const { format } = targetColumn}
      {format(data[data.length - 1])}
    {:else}
      No column selected
    {/if}
  </h2>
</div>

<style>
  div {
    flex: 1;
  }
</style>
