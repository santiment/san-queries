<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
</script>

<Tooltip position="right" align="center" offsetX={12} closeTimeout={0}>
  <div slot="trigger" class="info btn row hv-center mrg-l mrg--r">
    <Svg id="info" w="16" />
  </div>
  <div class="tooltip" slot="tooltip">
    <h3 class="txt-m mrg-m mrg--b">Add Parameter to ...</h3>
    <p class="c-waterloo">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi
    </p>
  </div>
</Tooltip>

<style>
  .info {
    --fill: var(--waterloo);
    --fill-hover: var(--black);
  }

  .tooltip {
    padding: 24px;
    max-width: 400px;
  }
</style>
