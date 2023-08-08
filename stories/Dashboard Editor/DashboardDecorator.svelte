<script>
  import { DashboardEditor$$ } from '$lib/DashboardEditor/ctx'
  import Grid from '$lib/DashboardEditor/Grid.svelte'

  export let widget

  // @ts-ignore
  DashboardEditor$$([widget])
</script>

<main class="column">
  <Grid />
</main>

<style>
  main {
    padding: 30px;
  }
</style>
