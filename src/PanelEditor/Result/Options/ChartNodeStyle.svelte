<script context="module" lang="ts">
  import { Node } from 'studio/Chart/nodes'
  import { tick } from 'svelte'

  const NodeLabel = {
    [Node.AREA]: 'Area',
    [Node.LINE]: 'Line',
    [Node.FILLED_LINE]: 'Filled area',
    [Node.GRADIENT_LINE]: 'Gradient line',
    [Node.BAR]: 'Bars',
  }

  const options = Object.keys(NodeLabel)
</script>

<script>
  import Field from 'webkit/ui/Field/Select.svelte'

  export let i
  export let column

  let selected = column.chartStyle || Node.LINE

  function onSelect(style) {
    column.chartStyle = style
    tick().then(() => {
      column.chartStyle = style
    })
  }
</script>

<Field title={`Column ${i}: Chart style`} bind:selected {options} {onSelect} class="mrg-xl mrg--b">
  {NodeLabel[selected]}

  <svelte:fragment slot="option" let:option>
    {NodeLabel[option]}
  </svelte:fragment>
</Field>
