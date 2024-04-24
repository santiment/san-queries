<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte'

  let className = ''
  export { className as class }
  export let btnClassName = ''
  export let align = 'start' as any
  export let dropdownClassName = ''
  export let tooltipClassName = ''
  export let disabled = false
  export let isOpened = false
  export let arrow = true
  export let contained = true
  export let padding = true
</script>

<div class="relative {className}">
  <Tooltip
    on="click"
    position="bottom"
    class="border bg-white {contained ? 'fluid' : ''} {tooltipClassName}"
    {align}
    bind:isOpened
  >
    <button
      slot="trigger"
      type="button"
      class="btn row v-center fluid gap-2 border text-left {btnClassName}"
      class:padding
      class:disabled
    >
      <slot close={() => (isOpened = false)} />

      {#if arrow}
        <Svg id="arrow-down" w="8" h="5" class="ml-auto" />
      {/if}
    </button>

    <div class="tooltip column text-left {dropdownClassName}" slot="tooltip">
      <slot name="dropdown" close={() => (isOpened = false)} />
    </div>
  </Tooltip>
</div>

<style>
  button {
    --fill: var(--waterloo);
    --border-hover: var(--green);
  }

  .padding {
    padding: 5px 12px;
  }

  .tooltip {
    padding: 8px;
  }
</style>
