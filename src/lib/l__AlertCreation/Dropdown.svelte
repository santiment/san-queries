<script lang="ts">
  import Dropdown from './DropdownRoot.svelte'

  type T = $$Generic

  let className = ''
  export { className as class }
  export let selected: T
  export let options = [] as T[]
  export let onSelect: (option: T) => unknown
  export let disabled = false
</script>

<Dropdown class={className} {disabled}>
  <slot option={selected} />

  <svelte:fragment slot="dropdown" let:close>
    {#each options as option}
      <button
        class="btn-ghost text-left"
        class:active={option === selected}
        on:click={() => {
          onSelect(option)
          close()
        }}
      >
        <slot {option} />
      </button>
    {/each}
  </svelte:fragment>
</Dropdown>

<style>
  button {
    padding: 5px 12px;
    --fill: var(--waterloo);
    --border-hover: var(--green);
  }

  .active {
    --color: var(--green);
  }
</style>
