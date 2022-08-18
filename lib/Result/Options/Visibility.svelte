<script>import Checkbox from 'san-webkit/lib/ui/Checkbox.svelte';
import Field from 'san-webkit/lib/ui/Field/svelte';
export let i;
export let column;
export let dateColumns;
export let isChartVisualization;

$: isDateColumn = isChartVisualization && dateColumns.has(column.id);

$: isActive = isDateColumn ? false : !column.isHidden;

function onClick() {
  column.isHidden = isActive;
}</script>

<Field title={`Column ${i}: Visibility`} let:classes>
  <button class="btn-ghost row v-center {classes}" class:disabled={isDateColumn} on:click={onClick}>
    <Checkbox class="mrg-s mrg--r" {isActive} />
    Is visible</button>
</Field>
