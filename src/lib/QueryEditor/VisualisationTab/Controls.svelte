<script lang="ts">
  import { slide } from 'svelte/transition'
  import Button from '$lib/ui/Button.svelte'
  import { cn } from '$lib/ui/utils'

  let { title, isOpenedDefault = true }: { title: string; isOpenedDefault?: boolean } = $props()

  let isOpened = $state(isOpenedDefault)

  function onClick() {
    isOpened = !isOpened
  }
</script>

<section class="rounded-md bg-athens p-4">
  <Button
    icon="arrow-down"
    iconSize="8"
    class={cn('font-medium', isOpened && 'opened')}
    onclick={onClick}>{title}</Button
  >

  {#if isOpened}
    <controls class="mt-4 flex flex-col gap-4" transition:slide={{ duration: 250 }}>
      <slot />
    </controls>
  {/if}
</section>

<style>
  .opened {
    --rotate: 0deg;
  }

  Svg {
    transition: transform 0.2s;
    transform: rotate(var(--rotate, -90deg));
  }
</style>
