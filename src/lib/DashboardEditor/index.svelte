<script lang="ts">
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  import { DashboardEditor$$ } from './ctx'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'

  const { dashboardEditor$ } = DashboardEditor$$()

  let title = ''

  $: ({ widgets } = $dashboardEditor$)

  $: layout = generateLayout(widgets)

  function generateLayout(widgets: any[]) {
    const layout = widgets.map((_, i) => [0, 1000 + i, 6, 2])
    normalizeGrid(sortLayout(layout))
    return layout
  }
</script>

<main class="column gap-m">
  <header>
    <ContentEditable as="h1" class="h4 txt-m mrg-s mrg--b" placeholder="Add your title here...">
      {title}
    </ContentEditable>

    <ContentEditable class="body-2" placeholder="Add description here...">
      {title}
    </ContentEditable>
  </header>

  <Grid tag="widgets" {layout} let:i let:gridItem rowSize={26}>
    {@const widget = widgets[i]}

    <widget use:gridItem class="column">
      {#if widget.type === 'TEXT'}
        <TextWidget {widget} />
      {:else if widget.type === 'HEADING'}
        <HeadingWidget {widget} />
      {/if}

      <Resizer onEnd={console.log} />
    </widget>
  </Grid>

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }

  widget > :global(*) {
    height: 100%;
  }
</style>
