<script context="module">export const getParameterSQL = ({
  key
}) => `{{${key}}}`;</script>

<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import ColorBorder from './../../lib/ColorBorder.svelte';
import { showParameterDialog } from './../../lib/ParameterDialog.svelte';
let className = '';
export let i;
export { className as class };
export let parameter;
export let color;
export let onUpdate;
export let onDelete;

$: ({
  key,
  value
} = parameter);

let ghost;

function onDrag(e) {
  const sql = getParameterSQL(parameter);
  e.dataTransfer.setData('text', sql);
  ghost = document.createElement('span');
  ghost.textContent = sql;
  ghost.style.position = 'absolute';
  ghost.style.zIndex = '-99999';
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, 0, 30);
}

function onDrop() {
  ghost === null || ghost === void 0 ? void 0 : ghost.remove();
}</script>

<ColorBorder
  draggable
  class="parameter-pRXEkm {className}"
  {color}
  on:click={() => showParameterDialog({ parameter, onSubmit: onUpdate })}
  on:dragstart={onDrag}
  on:dragend={onDrop}>
  {key}
  <span class="c-waterloo mrg-s mrg--l">{value}</span>

  <!-- 
  <div class="settings btn">
    <Svg id="vert-dots" w="2" h="12" />
  </div>
 -->

  <div class="delete btn" on:click|stopPropagation={() => onDelete(i)}>
    <Svg id="cross" w="8" />
  </div>
</ColorBorder>

<style lang="scss">:global(.parameter-pRXEkm) {
  padding-right: 5px !important;
}

.delete {
  margin-left: 13px;
  --fill-hover: var(--red);
  padding: 0 5px;
}</style>
