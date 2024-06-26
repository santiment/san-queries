<script lang="ts">
  import type { TEntities } from './api'

  import Entity from './Entity.svelte'
  import hillsSvg from './hills.svg'

  let { items }: { items: TEntities } = $props()
</script>

<section
  class="header relative flex items-center justify-center bg-rhino-day bg-no-repeat px-4 py-6 text-white-day"
>
  <h2 class="text-2xl">🔥 Discover Community Dashboards and Queries</h2>

  <img src={hillsSvg} alt="Hills" class="absolute bottom-0 right-0" />
</section>

<main class="mx-auto mt-8 w-full max-w-[1027px] pb-8">
  <!-- 
  <Button variant="border" icon="arrow-down" iconOnRight iconSize="8" class="ml-auto">
    Show all
  </Button>
 -->

  <section class="mt-3 flex flex-col gap-3">
    {#each items as item}
      {#if item}
        <Entity type={item.type} {item}></Entity>
      {/if}
    {/each}
  </section>
</main>

<style>
  .header {
    background-position: -5% bottom;
    background-image: url('./eye.svg');
  }
</style>
