<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { newPanel } from './../../lib/stores/dashboard';
import { PanelData } from './../../lib/types';
import { getAppContext } from './../../lib/context';
const {
  dashboard$
} = getAppContext();
let isOpened = false;

function onSelect({
  type,
  label
}) {
  const panel = newPanel(`My panel (${label.toLowerCase()})`, type);
  panel.__scrollOnMount = true;
  const dashboard = $dashboard$;
  dashboard.panels.push(panel);
  dashboard$.set(dashboard);
  isOpened = false;
}</script>

<div class="relative">
  <Tooltip on="click" position="bottom" class="tooltip-jDyMfi" bind:isOpened>
    <button slot="trigger" class="new btn-2 relative">
      New panel
      <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
    </button>

    <div slot="tooltip" class="column">
      {#each PanelData as panel}
        <button class="btn-ghost" on:click={() => onSelect(panel)}>{panel.label}</button>
      {/each}
    </div>
  </Tooltip>
</div>

<style lang="scss">.new {
  padding: 5px 12px 5px 14px;
}
.new::after {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 32px;
  border-left: 1px solid var(--porcelain);
  content: "";
}

:global(.tooltip-jDyMfi) {
  padding: 8px;
  width: 100%;
}</style>
