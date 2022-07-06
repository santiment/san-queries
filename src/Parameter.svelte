<script>
  import Svg from 'webkit/ui/Svg/svelte'
</script>

<button class="btn row v-center">
  <div class="color" />
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
</button>

<style lang="scss">
  button {
    --bg: var(--white);
    padding: 6px 12px 6px 8px;
    box-shadow: inset 0px 0px 0px 1px var(---border, var(--porcelain));
    position: relative;
    border-radius: 2px 4px 4px 2px;
    overflow: hidden;

    &:hover {
      ---border: var(--green);
    }
  }

  .color {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background: red;
  }

  .settings {
    margin: 0 19px;
  }

  .btn {
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }

  .delete {
    margin-left: 19px;
    --fill-hover: var(--red);
  }
</style>
