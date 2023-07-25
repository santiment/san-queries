<script>
  import Svg from 'webkit/ui/Svg/svelte'

  let isHovered = false
</script>

<article
  class="btn row v-center"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
>
  Data exploration

  {#if isHovered}
    <actions class="row">
      <button class="btn-3"><Svg id="external-link" w="12" /></button>
      <button class="btn-3"><Svg id="vert-dots" w="3" h="12" /></button>
    </actions>
  {/if}
</article>

<style>
  article {
    padding: 6px 10px;
    --bg-hover: var(--white);
  }

  actions {
    margin: -6px -10px -6px auto;
  }
</style>
