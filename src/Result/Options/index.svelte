<script>
  import Field from '@/Field.svelte'
  import TitleOption from './Title.svelte'
  import FormatOption from './Format.svelte'

  export let visualization
  export let headers
  export let columns
</script>

<h3 class="body-2">Options</h3>

<div class="scroll">
  <Field title="Table name" placeholder="My table" bind:value={visualization.title} />

  {#each columns as column, i}
    <TitleOption bind:column {i} {headers} />
    <FormatOption bind:column {i} />
  {/each}
</div>

<style>
  h3 {
    border-bottom: 1px solid var(--porcelain);
    padding: 0 0 16px;
  }

  .scroll {
    flex: 1;
    --max-height: 446px;
  }
</style>
