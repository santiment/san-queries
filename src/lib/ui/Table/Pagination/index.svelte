<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements'
  import type { SS } from 'svelte-runes'

  import Button from '$lib/ui/Button.svelte'
  import Input from '$lib/ui/Input.svelte'
  import CompactPagination from './CompactPagination.svelte'
  import { cn } from '$lib/ui/utils'

  const MAX_WIDTH_FOR_PAGE_CONTROLS = 540

  let {
    totalItems,
    page,
    pageSize,
  }: { totalItems: number; page: SS<number>; pageSize: SS<number> } = $props()

  let clientWidth = $state(0)
  let pagesAmount = $derived(Math.ceil(totalItems / pageSize.$))
  let maxPage = $derived(pagesAmount - 1)

  let isCompact = $derived(clientWidth && clientWidth < MAX_WIDTH_FOR_PAGE_CONTROLS)

  function onPrevClick() {
    if (page.$ <= 1) page.$ = 0
    else page.$ -= 1
    // onPageChange(page, pageSize)
  }

  function onNextClick() {
    if (page.$ >= pagesAmount) page.$ = maxPage
    else page.$ += 1
    // onPageChange(page, pageSize)
  }
  const onPageInput: ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    const value = +currentTarget.value

    if (!value || value < 1) page.$ = 0
    else if (value > pagesAmount) page.$ = maxPage
    else page.$ = value - 1

    currentTarget.value = `${page.$ + 1}`
    // onPageChange(page, pageSize)
  }
</script>

<section
  class={cn(
    'flex items-center gap-4 text-nowrap',
    isCompact ? 'justify-center gap-2 py-2' : 'gap-4 px-8 py-4',
  )}
  bind:clientWidth
>
  {#if isCompact}
    <CompactPagination {page} {totalItems} {pageSize}></CompactPagination>
  {:else}
    <div class="flex items-center gap-2 text-waterloo">
      Page

      <Input
        class="w-[48px]"
        type="number"
        min="1"
        value={page.$ + 1}
        max={maxPage}
        onchange={onPageInput}
      ></Input>

      of {pagesAmount}

      <span class="ml-1">
        ({totalItems} rows total)
      </span>
    </div>

    <nav class="ml-auto flex gap-2 fill-waterloo">
      <Button
        variant="border"
        icon="arrow-right"
        iconSize="5"
        iconHeight="8"
        iconOnRight
        class="[&>svg]:rotate-180"
        disabled={page.$ <= 0}
        onclick={onPrevClick}
      >
        Prev
      </Button>
      <Button
        variant="border"
        icon="arrow-right"
        iconSize="5"
        iconHeight="8"
        disabled={page.$ >= maxPage}
        onclick={onNextClick}>Next</Button
      >
    </nav>
  {/if}
</section>

<style lang="postcss">
  Input > :global(input) {
    text-align: center;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
</style>
