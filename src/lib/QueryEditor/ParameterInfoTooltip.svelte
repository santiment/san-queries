<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'
  import Svg from 'webkit/ui/Svg/svelte'
  import { track } from 'san-webkit/lib/analytics'

  function onButtonClick() {
    track.event('parameters_info_click', {
      category: 'Interaction',
      source: 'query_editor_sql',
      source_url: window.location.href,
    })
  }
</script>

<Tooltip let:trigger on="click" position="bottom" closeDelay={0}>
  <button use:trigger class="info btn-3 c-waterloo" on:click={onButtonClick}>
    <Svg id="info" w="12" />
  </button>

  <tooltip slot="tooltip">
    <p class="c-waterloo">
      A parameter is a placeholder for some value. Parameters allow the creation of more interactive
      and dynamic dashboards. They provide an easy way to add and change values (e.g. dates,
      metrics, assets, addresses) without hardcoding them in the SQL.
      <br class="mrg-s mrg--b" />
      A parameter has a name, type and value. In the query parameters are represented as
      <span class="code caption c-black">{`{{<name>}}`}</span>. When the query is executed, the
      parameter template is replaced by its value.
    </p>
  </tooltip>
</Tooltip>

<style>
  .info {
    margin: 0 8px 0 -8px;
  }

  .code {
    font-family: monospace;
    background: var(--porcelain);
    padding: 2px 4px;
    border-radius: 4px;
  }

  tooltip {
    padding: 24px;
    max-width: 400px;
  }
</style>
