<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import ColorBorder from '@/ColorBorder.svelte'
</script>

<ColorBorder>
  Name/Address:
  <span class="c-waterloo mrg-s mrg--l">Value</span>

  <!-- 
  <div class="settings btn">
    <Svg id="vert-dots" w="2" h="12" />
  </div>
 -->

  <div class="delete btn" on:click={() => console.log(123)}>
    <Svg id="cross" w="8" />
  </div>
</ColorBorder>

<style lang="scss">
  .settings {
    margin: 0 19px;
  }

  .delete {
    margin-left: 19px;
    --fill-hover: var(--red);
  }
</style>
