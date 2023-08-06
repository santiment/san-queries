<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Editor from 'webkit/ui/Editor'
  // import ContentEditable from '../ContentEditable.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'
  // import { default as MD } from 'medium-editor'
  // console.log(MD)

  export let widget: any

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)
  }
</script>

<text-widget class="row border body-2 relative">
  <Editor placeholder="Add your text here..." />
  <!-- <ContentEditable /> -->

  <button class="close btn-3" on:click={onCloseClick}>
    <Svg id="close" w="12" />
  </button>
</text-widget>

<style>
  ContentEditable,
  Editor {
    padding: 16px 48px 16px 24px;
    overflow: auto;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 16px;
  }
</style>
