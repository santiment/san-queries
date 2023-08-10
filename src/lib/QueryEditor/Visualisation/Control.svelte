<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip'

  export let name: string
  export let options = [] as any[]
  export let value: any
  export let onUpdate: (value: any) => void
</script>

<control class="column gap-s relative">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="caption txt-m c-waterloo">{name}</label>

  {#if options.length}
    <Tooltip on="click" position="bottom" activeClass="$style.opened" let:trigger>
      <options use:trigger class="btn input row v-center justify gap-m">
        {value}

        <Svg id="arrow-down" w="8" h="5" />
      </options>

      <svelte:fragment slot="tooltip" let:close>
        {#each options as option}
          <button
            class="btn-ghost"
            on:click={() => {
              onUpdate(option)
              close()
            }}
          >
            {option}
          </button>
        {/each}
      </svelte:fragment>
    </Tooltip>
  {:else}
    <input type="text" class="input" />
  {/if}
</control>

<style>
  input {
    border-radius: 6px;
  }

  .opened {
    border-color: var(--green);
  }

  Tooltip {
    padding: 8px;
    width: 100% !important;
  }
</style>
