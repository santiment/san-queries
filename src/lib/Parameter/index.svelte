<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'

  export let parameter: { key: string; value: string }
  export let color: string

  $: ({ key, value } = parameter)
</script>

<parameter class="row v-center gap-s border" style="---color:{color}">
  <color />

  {key}
  <span class="caption c-waterloo">{value}</span>

  <button class="close btn">
    <Svg id="close" w="10" />
  </button>
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

  button {
    display: flex;
    align-items: center;
    --color: var(--waterloo);
    --color-hover: var(--green);
  }

  .close {
    margin: 0 3px 0 11px;
  }
</style>
