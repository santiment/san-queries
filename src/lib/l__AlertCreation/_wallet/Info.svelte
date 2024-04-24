<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
</script>

<section class="info mrg-l mrg--b">
  <div class="row v-center">
    <Svg id="info" w="12" class="mr-3" />
    <slot />
  </div>
  <div class="c-waterloo ml-7">
    <slot name="description" />
  </div>
</section>

<style>
  .info {
    padding: 16px 16px 12px;
    background: var(--athens);
    border-radius: 6px;
    fill: var(--waterloo);
  }
</style>
