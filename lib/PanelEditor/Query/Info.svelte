<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';</script>

<Tooltip position="bottom" align="end" offsetX={-42} closeTimeout={0}>
  <div slot="trigger" class="info btn row hv-center mrg-l mrg--r">
    <Svg id="info" w="16" />
  </div>
  <div class="tooltip" slot="tooltip">
    <h3 class="txt-m mrg-m mrg--b">Add Parameter to ...</h3>
    <p class="c-waterloo">
      A parameter is a placeholder for some value. Parameters allow the creation of more interactive
      and dynamic dashboards. They provide an easy way to add and change values (e.g. dates,
      metrics, assets, addresses) without hardcoding them in the SQL.
      <br class="mrg-s mrg--b" />
      A parameter has a name, type and value. In the query parameters are represented as
      <span class="code caption c-black">{`{{<name>}}`}</span>. When the query is executed, the
      parameter template is replaced by its value.
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

  .code {
    font-family: monospace;
    background: var(--porcelain);
    padding: 2px 4px;
    border-radius: 4px;
  }
</style>
