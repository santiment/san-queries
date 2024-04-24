<script lang="ts">
  import type { CategoryType, SelectedCategory } from './categories'

  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { CATEGORIES, normalizeCategory } from './categories'

  export let category: SelectedCategory

  function onCategoryClick(item: CategoryType) {
    category = normalizeCategory(item)
  }
</script>

<main>
  <h2 class="h4 mrg-xxl mrg--b">Choose an alert category below:</h2>

  <section>
    {#each CATEGORIES as item}
      {@const { title, description, icon } = item}
      <button class="btn c-fiord border" on:click={() => onCategoryClick(item)}>
        <h3 class="body-1 c-black row v-center mrg-m mrg--b">
          <Svg id={icon} w="16" />
          {title}
        </h3>
        {description}
      </button>
    {/each}
  </section>
</main>

<style>
  main {
    padding: 32px 48px;
  }

  section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(244px, 1fr));
    gap: 16px;
  }

  button {
    padding: 20px 32px 32px;
    --border-hover: var(--green);
    fill: var(--waterloo) !important;
  }

  h3 {
    gap: 12px;
  }
</style>
