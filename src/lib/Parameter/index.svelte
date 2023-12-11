<script lang="ts">
  import { noop } from 'webkit/utils'
  import Svg from 'webkit/ui/Svg/svelte'

  export let parameter: { key: string; value: string; global: boolean }
  export let color: string
  export let isAuthor = true
  export let onRemoveClick = null as null | (() => void)
  export let onLinkClick = null as null | (() => void)

  $: ({ key, value, global = false } = parameter)
  $: shortValue = value.toString()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<parameter class="row v-center gap-s border" style="---color:{color}" on:click>
  <color />

  {#if global}
    <span class="caption txt-m">GP</span>
  {/if}

  {key}

  <span class="c-waterloo"
    >{shortValue.length > 10
      ? `${shortValue.slice(0, 4)}...${shortValue.slice(-3)}`
      : shortValue}</span
  >

  {#if isAuthor && (onLinkClick || onRemoveClick)}
    <div class="divider" />

    <actions class="row">
      {#if onLinkClick}
        <button class="link btn">
          <Svg id="link" w="15" />
        </button>
      {/if}

      {#if onRemoveClick}
        <button class="close btn" on:click|capture|stopPropagation={onRemoveClick}>
          <Svg id="close" w="10" />
        </button>
      {/if}
    </actions>
  {/if}
</parameter>

<style>
  parameter {
    height: 32px;
    padding: 0 8px;
    border-radius: 6px;
    position: relative;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  color {
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: 2px;
    background: var(---color);
    overflow: hidden;
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
  }

  actions {
    margin: 0 -6px 0 -8px;
  }

  button {
    height: 30px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  .link {
    --color: var(--black);
  }

  .divider {
    width: 1px;
    background: var(--porcelain);
    margin: -4px 4px;
    height: 100%;
  }
</style>
