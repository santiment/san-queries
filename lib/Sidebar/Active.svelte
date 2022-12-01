<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
let className = '';
export { className as class };</script>

<div class="circle row hv-center mrg-s mrg--r {className}">
  <Svg id="checkmark-large" w="6" h="5" />
</div>

<style>
  .circle {
    width: 16px;
    height: 16px;
    min-width: 16px;
    background: var(--porcelain);
    border-radius: 50%;
    fill: var(--waterloo);
  }
</style>
