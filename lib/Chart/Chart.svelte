<script>import { ui$ } from 'san-webkit/lib/stores/ui';
import { getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates';
import { themes } from 'san-studio/lib/Chart/theme';
import { getMetricNodes } from 'san-studio/lib/Chart/nodes';
import Chart from 'san-studio/lib/Chart/index.svelte';
import Lines from 'san-studio/lib/Chart/Lines.svelte';
import Areas from 'san-studio/lib/Chart/Areas.svelte';
import Bars from 'san-studio/lib/Chart/Bars.svelte';
import Axes from 'san-studio/lib/Chart/Axes/index.svelte';
import Tooltip from 'san-studio/lib/Chart/Tooltip/index.svelte';
import { FORMATTER } from 'san-studio/lib/metrics/formatters';
export let data;
export let metrics;
export let colors;
export let axesMetricKeys;
export let onChart;

$: theme = themes[+$ui$.nightMode]; // +$globals.isNightMode]


$: categories = getMetricNodes(metrics, {});

$: metricSettings = getTooltipSettings(metrics);

function getTooltipSettings(metrics) {
  const metricSettings = {
    datetime: {
      formatter: value => {
        const date = new Date(value);
        const {
          HH,
          mm
        } = getTimeFormats(date);
        const {
          MMMM,
          DD,
          YYYY
        } = getDateFormats(date);
        return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`;
      }
    }
  };
  metrics.forEach(column => {
    const {
      key,
      formatter = FORMATTER,
      label,
      axisFormatter = formatter
    } = column;
    metricSettings[key] = Object.assign({
      label,
      formatter,
      axisFormatter
    });
  });
  return metricSettings;
}</script>

<Chart {data} {categories} {theme} {colors} {onChart}>
  <Bars />
  <Areas />
  <Lines />

  <Axes {axesMetricKeys} {metricSettings} xTicks={10} />

  {#if process.browser}
    <Tooltip {axesMetricKeys} {metricSettings} isShiftForced />
  {/if}
</Chart>
