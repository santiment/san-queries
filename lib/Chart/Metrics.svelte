<script>import ColorBorder from './../../lib/ColorBorder.svelte';
export let metrics;
export let colors;
export let onMetricHover;
let hoveredMetric;
let hoverTimer;

const clearHover = () => clearTimeout(hoverTimer);

function hoverMetric(metric) {
  hoveredMetric = metric;
  onMetricHover(metric);
}

function onEnter(metric) {
  clearHover();
  if (hoveredMetric) return hoverMetric(metric);
  hoverTimer = window.setTimeout(() => hoverMetric(metric), 120);
}

function onLeave() {
  clearHover();
  if (hoveredMetric) hoverTimer = window.setTimeout(() => hoverMetric(), 100);
}</script>

<div class="metrics row mrg-xs mrg--t">
  {#each metrics as metric, i (metric)}
    <ColorBorder color={colors[i]} on:mouseenter={() => onEnter(metric)} on:mouseleave={onLeave}>
      {metric.label}
    </ColorBorder>
  {/each}
</div>

<style>
  .metrics {
    gap: 8px;
  }
</style>
