<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import ContentEditable from '../ContentEditable.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'

  export let widget: any

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)
  }
</script>

<heading-widget class="h4 txt-m relative">
  <ContentEditable as="h2" placeholder="Add heading here">
    {widget.value || ''}
  </ContentEditable>

  <button class="close btn-3" on:click={onCloseClick}>
    <Svg id="close" w="12" />
  </button>
</heading-widget>

<style>
  heading-widget {
    background: var(--athens);
    border-radius: 6px;
  }

  ContentEditable {
    padding: 16px 48px 16px 24px;
    height: 100%;
    overflow: auto;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
