<script>let className = '';
export { className as class };
export let color = '#ff0000';</script>

<button
  {...$$restProps}
  class="btn row v-center {className}"
  style="--b-color:{color}"
  on:click
  on:mouseenter
  on:mouseleave
  on:dragstart
  on:dragend>
  <div class="color" />
  <slot />
</button>

<style lang="scss">button {
  --bg: var(--white);
  padding: 6px 12px 6px 8px;
  box-shadow: inset 0px 0px 0px 1px var(---border, var(--porcelain));
  position: relative;
  border-radius: 2px 4px 4px 2px;
  overflow: hidden;
}
button:hover {
  ---border: var(--b-color);
}

.color {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background: var(--b-color);
}

.btn {
  --fill: var(--waterloo);
  --fill-hover: var(--green);
}</style>
