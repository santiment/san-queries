<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip'

  export let name: string
  export let options = [] as any[]
  export let value = null as any
  export let onUpdate: (value?: any) => void
  export let placeholder = ''
  export let defaultValue = ''

  function onInput(e: Event) {
    const inputNode = e.currentTarget as HTMLInputElement

    onUpdate(inputNode.value.trim())
  }

  function onInputBlur(e: Event) {
    const inputNode = e.currentTarget as HTMLInputElement

    inputNode.value = inputNode.value.trim()
  }
</script>

<control class="column gap-s relative">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="caption txt-m c-waterloo">{name}</label>

  {#if options.length}
    <Tooltip on="click" position="bottom" activeClass="$style.opened" let:trigger>
      <options use:trigger class="btn input row v-center justify gap-m">
        {#if value}
          <slot option={value}>
            {value}
          </slot>
        {:else}
          <span class="default">
            {defaultValue}
          </span>
        {/if}

        <Svg id="arrow-down" w="8" h="5" />
      </options>

      <svelte:fragment slot="tooltip" let:close>
        {#if defaultValue}
          <button class="btn-ghost" on:click={() => (onUpdate(), close())}>
            {defaultValue}
          </button>
        {/if}

        {#each options as option}
          <button class="btn-ghost" on:click={() => (onUpdate(option), close())}>
            <slot {option}>
              {option}
            </slot>
          </button>
        {/each}
      </svelte:fragment>
    </Tooltip>
  {:else}
    <input
      type="text"
      class="input"
      {value}
      {placeholder}
      on:input={onInput}
      on:blur={onInputBlur}
    />
  {/if}
</control>

<style>
  input {
    border-radius: 6px;
  }

  .opened {
    border-color: var(--green);
  }

  options {
    --bg: var(--white);
  }

  Tooltip {
    padding: 8px;
    width: 100% !important;
  }

  .default {
    color: var(--casper);
    opacity: 0.5;
  }
</style>
