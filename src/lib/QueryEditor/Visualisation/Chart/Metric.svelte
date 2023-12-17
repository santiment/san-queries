<script lang="ts">
  import { noop } from 'webkit/utils'
  import Svg from 'webkit/ui/Svg/svelte'

  export let metric: { key: string; value: string; global: boolean }
  export let isAuthor = true
  export let onRemoveClick = null as null | (() => void)

  $: ({ key, title, color } = metric)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<metric class="row v-center gap-s border" style="---color:{color}" on:click>
  <color />

  <span class="c-black">
    {title}
  </span>

  {#if isAuthor && onRemoveClick}
    <div class="divider" />

    <actions class="row">
      {#if onRemoveClick}
        <button class="close btn" on:click|capture|stopPropagation={onRemoveClick}>
          <Svg id="close" w="10" />
        </button>
      {/if}
    </actions>
  {/if}
</metric>

<style>
  metric {
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
