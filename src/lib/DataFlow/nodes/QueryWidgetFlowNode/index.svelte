<script lang="ts">
  import { Position } from '@xyflow/svelte'
  import type { TCanvasNode } from './node.svelte'
  import GenericHandle from '../GenericNode/Handle.svelte'

  let { instance }: { instance: TCanvasNode['data']['instance'] } = $props()

  const inputs = $derived(Object.keys(instance.inputs))
  const outputs = $derived(Object.keys(instance.outputs))
</script>

<h2 class="px-1">{instance.name}</h2>

{#if instance.inputs}
  <hr class="border-t-2" />

  <span class="pl-1">Parameters:</span>

  {#each inputs as key}
    <div class="relative">
      <GenericHandle type="input" id={key} />

      <span class="relative px-4"> {key} </span>
    </div>
  {/each}
{/if}

<hr class="border-t-2" />

<span class="pl-1">Columns:</span>

{#each outputs as column}
  <div class="relative px-4">
    <span>
      {column}
    </span>

    <GenericHandle type="output" id={column} />
  </div>
{:else}
  <div class="px-4">
    No columns found.
    <br />
    Re-run query to get columns
  </div>
{/each}
