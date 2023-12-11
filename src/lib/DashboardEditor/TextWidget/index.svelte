<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Editor from 'webkit/ui/Editor'
  import { markdownToHTML } from 'webkit/ui/Editor/markdown'
  import { getDashboardEditor$Ctx } from '../ctx'
  import { EventAutoSave$ } from '$routes/(editor)/query/events'
  // import 'medium-editor'

  export let widget: App.Dashboard.TextWidget

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  let editor: any

  function onBlur() {
    if (!editor) return

    const value = editor.serialize()
    if (!value) return

    widget.value = value

    EventAutoSave$.dispatch()
  }

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)

    EventAutoSave$.dispatch()
  }
</script>

<text-widget class="row border body-2 relative" on:focusout={onBlur}>
  <Editor
    bind:editor
    placeholder="Add your text here..."
    html={widget.value ? markdownToHTML(widget.value) : undefined}
  />
  <!-- <ContentEditable /> -->

  <button class="close btn-3" on:click={onCloseClick}>
    <Svg id="close" w="12" />
  </button>
</text-widget>

<style>
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
