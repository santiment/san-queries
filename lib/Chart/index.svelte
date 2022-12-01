<script>import { newChartColors, newHighlightedColors } from 'san-studio/lib/Chart/colors';
import { downloadPng } from './../../lib/PanelEditor/Result/downloadPng';
import Chart from './Chart.svelte';
import Metrics from './Metrics.svelte';
export let columns;
export let dateColumns;
export let data;
let chart;

$: xAxisKey = [...dateColumns][0];

$: metrics = data.length ? columns.filter(({
  id
}) => !dateColumns.has(id) && Number.isFinite(data[0][id])).map(({
  id,
  title,
  formatter,
  chartStyle
}) => ({
  key: id.toString(),
  label: title,
  node: chartStyle || 'line',
  formatter
})) : [];

$: chartData = data.map(row => ({ ...row,
  datetime: Date.parse(row[xAxisKey])
})).sort(datetimeSorter);

$: rawColors = newChartColors(metrics);

$: colors = rawColors;

$: axesMetricKeys = metrics.map(({
  key
}) => key);

function onMetricHover(metric) {
  colors = metric ? newHighlightedColors(rawColors, metric) : rawColors;
}

function datetimeSorter(a, b) {
  return a.datetime - b.datetime;
}

export function download(title) {
  downloadPng(chart, metrics, title);
}</script>

<Metrics {metrics} {colors} {onMetricHover} />

<Chart
  data={chartData}
  {metrics}
  {colors}
  {axesMetricKeys}
  onChart={(_chart) => (chart = _chart)} />
