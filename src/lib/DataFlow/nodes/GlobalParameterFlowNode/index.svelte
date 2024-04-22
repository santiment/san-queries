<script lang="ts">
  import { Position } from '@xyflow/svelte'
  import GenericHandle from '../GenericNode/Handle.svelte'

  let { instance } = $props()

  // console.log(instance)
  let { parameter } = instance

  let shortValue = $derived(parameter.value.toString())
</script>

<div class="p-1">
  <h2>{parameter.key}</h2>

  <div>
    Default:
    <span class="c-waterloo">
      {shortValue.length > 10 ? `${shortValue.slice(0, 4)}...${shortValue.slice(-3)}` : shortValue}
    </span>
  </div>
</div>

<GenericHandle id="value" type="input" />

<GenericHandle id="value" type="output" .Right} />
