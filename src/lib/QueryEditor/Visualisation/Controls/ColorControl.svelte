<script lang="ts">
  import { debounce$$ } from 'san-webkit/lib/utils/fn'
  import ColorPicker from './ColorPicker/index.svelte'
  import Control from '../Control.svelte'
  import { COLORS } from '$lib/Parameter'

  export let column: string
  export let settings: Record<string, any>
  export let update: any

  $: color = settings?.chartColor || COLORS[0]

  const onChange$ = debounce$$(150, (value: string) => {
    if (value.includes('NaN')) return

    update(column, { chartColor: value })
  })
</script>

<Control name="Color on chart" options={[]} value={color} defaultValue={'Default color'}>
  <div class="row hv-center gap-s">
    <div class="color" style="--color:{color}" />
    {color}
  </div>

  <svelte:fragment slot="dropdown">
    <ColorPicker {color} onChange={$onChange$} />
  </svelte:fragment>
</Control>

<style>
  .color {
    background: var(--color);
    border-radius: 2px;
    width: 10px;
    height: 10px;
  }
</style>
