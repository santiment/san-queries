<script context="module">
  export const getParameterSQL = ({ name }) => `{{${name}}}`
</script>

<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import ColorBorder from '@/ColorBorder.svelte'
  import { showParameterDialog } from '@/ParameterDialog.svelte'

  let className = ''
  export { className as class }
  export let parameter
  export let color
  export let onUpdate

  $: ({ name, value } = parameter)

  let ghost
  function onDrag(e) {
    const sql = getParameterSQL(parameter)
    e.dataTransfer.setData('text', sql)

    ghost = document.createElement('span')
    ghost.textContent = sql
    ghost.style.position = 'absolute'
    ghost.style.zIndex = '-99999'
    document.body.appendChild(ghost)

    e.dataTransfer.setDragImage(ghost, 0, 30)
  }

  function onDrop() {
    ghost?.remove()
  }
</script>

<ColorBorder
  draggable
  class={className}
  {color}
  on:click={() => showParameterDialog({ parameter, onSubmit: onUpdate })}
  on:dragstart={onDrag}
  on:dragend={onDrop}>
  {name}
  <span class="c-waterloo mrg-s mrg--l">{value}</span>

  <!-- 
  <div class="settings btn">
    <Svg id="vert-dots" w="2" h="12" />
  </div>
 -->

  <div class="delete btn" on:click|stopPropagation={() => console.log(123)}>
    <Svg id="cross" w="8" />
  </div>
</ColorBorder>

<style lang="scss">
  .settings {
    margin: 0 19px;
  }

  .delete {
    margin-left: 19px;
    --fill-hover: var(--red);
  }
</style>
