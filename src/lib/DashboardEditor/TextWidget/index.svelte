<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import ContentEditable from '../ContentEditable.svelte'
</script>

<text-widget class="border body-2 relative">
  <ContentEditable placeholder="Add text here" />

  <button class="close btn-3">
    <Svg id="close" w="12" />
  </button>
</text-widget>

<style>
  ContentEditable {
    padding: 16px 48px 16px 24px;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 16px;
  }
</style>
