<script lang="ts">
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  import { DashboardEditor$$ } from './ctx'
  import Grid from './Grid.svelte'

  let className = ''
  export { className as class }

  // const { dashboardEditor$ } = DashboardEditor$$()
  DashboardEditor$$()

  let title = ''
</script>

<main class="column gap-m {className}">
  <header>
    <ContentEditable as="h1" class="h4 txt-m mrg-s mrg--b" placeholder="Add your title here...">
      {title}
    </ContentEditable>

    <ContentEditable class="body-2" placeholder="Add description here...">
      {title}
    </ContentEditable>
  </header>

  <Grid />

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
