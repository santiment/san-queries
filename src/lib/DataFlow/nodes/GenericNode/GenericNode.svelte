<script lang="ts">
  import Button from '$lib/ui/Button.svelte'
  import { Position, useUpdateNodeInternals } from '@xyflow/svelte'
  import GenericHandle from './Handle.svelte'
  import { useObserve } from 'svelte-runes'
  import { tap, timer } from 'rxjs'
  import type { TCanvasNode } from '../QueryWidgetFlowNode/node.svelte'

  let { id, data }: { id: string; data: TCanvasNode['data'] } = $props()
  let instance = $derived(data.instance)

  const updateNodeInternals = useUpdateNodeInternals()

  useObserve(() => timer(200).pipe(tap(() => updateNodeInternals(id))))
</script>

<section class="border bg-white">
  <header class="flex items-center bg-porcelain px-1 pr-0.5">
    <span class="mr-8 text-xs">
      {instance.type}
    </span>

    <div class="ml-auto"></div>

    <Button icon="info" iconSize="6.5" iconHeight="6" class="size-3"></Button>

    <Button icon="close" iconSize="5" class="size-3"></Button>
  </header>

  {#if instance.Component}
    <div>
      {#await instance.Component() then { default: Component }}
        <svelte:component this={Component} {id} {instance}></svelte:component>
      {/await}
    </div>
  {:else}
    <div class="relative px-1">
      <h2>{instance.name}</h2>

      {#each Object.keys(instance.inputs) as input (input)}
        <GenericHandle id={input} nodeId={id} type="input" position={Position.Left}></GenericHandle>
      {/each}

      {#each Object.keys(instance.outputs) as output (output)}
        <GenericHandle id={output} nodeId={id} type="output" position={Position.Right}
        ></GenericHandle>
      {/each}
    </div>
  {/if}
</section>

<style>
  :global(.svelte-flow__node.selected) section {
    border-color: var(--blue);
  }
</style>
