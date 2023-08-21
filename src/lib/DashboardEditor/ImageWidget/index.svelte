<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { getDashboardEditor$Ctx } from '../ctx'

  export let widget: App.Dashboard.ImageWidget

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)
  }
</script>

<image-widget class="column hv-center border relative">
  <img src={widget.src} alt="Image widget" />

  <button class="close btn-3" on:click={onCloseClick}>
    <Svg id="close" w="12" />
  </button>
</image-widget>

<style>
  .close {
    position: absolute;
    top: 10px;
    right: 16px;
  }

  img {
    max-height: 100%;
    max-width: 96%;
    pointer-events: none;
  }
</style>
