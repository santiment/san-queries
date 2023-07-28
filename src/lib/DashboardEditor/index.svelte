<script lang="ts">
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  import { DashboardEditor$$ } from './ctx'
  import TextWidget from './TextWidget/index.svelte'

  const { dashboardEditor$ } = DashboardEditor$$()

  let title = ''

  $: ({ widgets } = $dashboardEditor$)
</script>

<main class="column gap-m">
  <header>
    <ContentEditable
      element="h1"
      class="h4 txt-m mrg-s mrg--b"
      placeholder="Add your title here..."
    >
      {title}
    </ContentEditable>

    <ContentEditable element="h1" class="body-2" placeholder="Add description here...">
      {title}
    </ContentEditable>
  </header>

  {#each widgets as widget}
    {#if widget.type === 'TEXT'}
      <TextWidget />
    {/if}
  {/each}

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
