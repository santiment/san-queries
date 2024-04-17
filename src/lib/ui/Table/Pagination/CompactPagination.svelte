<script lang="ts">
  import type { SS } from 'svelte-runes'
  import type { ChangeFn } from '@melt-ui/svelte/internal/helpers'

  import Button from '$lib/ui/Button.svelte'
  import { createPagination } from '@melt-ui/svelte'

  let {
    page,
    totalItems,
    pageSize,
  }: { page: SS<number>; totalItems: number; pageSize: SS<number> } = $props()

  const {
    elements: { pageTrigger, prevButton, nextButton },
    states: { pages },
  } = createPagination({
    count: totalItems,
    perPage: pageSize.$,
    defaultPage: 1,
    siblingCount: 1,
    onPageChange,
  })

  function onPageChange({ next }: Parameters<ChangeFn<number>>[0]) {
    page.$ = next - 1
    return next
  }
</script>

<Button
  {...$prevButton}
  variant="border"
  icon="arrow-right"
  iconSize="5"
  iconHeight="8"
  iconOnRight
  class="[&>svg]:rotate-180"
  action={prevButton}
></Button>

{#each $pages as page (page.key)}
  {#if page.type === 'ellipsis'}
    <span>...</span>
  {:else}
    <Button
      {...$pageTrigger(page)}
      variant="border"
      action={pageTrigger}
      class="data-[selected]:text-green">{page.value}</Button
    >
  {/if}
{/each}

<Button
  {...$nextButton}
  variant="border"
  icon="arrow-right"
  iconSize="5"
  iconHeight="8"
  action={nextButton}
></Button>

<style lang="postcss">
  Button {
    @apply h-[31px] w-[31px] justify-center px-0;
  }
</style>
