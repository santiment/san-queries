<script>
  import { DashboardEditor$$ } from '$lib/DashboardEditor/ctx'
  import Grid from '$lib/DashboardEditor/Grid.svelte'

  export let widget

  DashboardEditor$$([widget])
</script>

<main class="column">
  <Grid />
</main>

<style>
  main {
    padding: 30px;
  }

  widget > :global(*) {
    height: 100%;
  }
</style>
