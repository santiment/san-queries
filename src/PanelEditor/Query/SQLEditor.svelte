<script lang="ts">
  import { onMount } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import SQLEditor from '@/SQLEditor/Async.svelte'
  import { updateThemeParameters } from '@/SQLEditor/theme'

  export let panel
  export let editor
  export let error = ''
  export let controller

  controller.setValue = setValue

  let iframe

  $: ({ query, parameters } = panel.sql)
  $: if (editor) editor.onDidBlurEditorText(onBlur)
  $: updateThemeParameters(parameters)

  function onBlur() {
    panel.sql.query = editor.getValue()
  }

  function setValue(value) {
    editor.setValue(value)
    panel.sql.query = value
  }

  function onResize() {
    if (editor) {
      const { offsetWidth: width, offsetHeight: height } = iframe
      editor.layout({ width, height })
    }
  }

  onMount(() => {
    if (iframe.contentWindow) iframe.contentWindow.onresize = onResize
  })
</script>

<div class="editor border mrg-l mrg--b relative">
  <SQLEditor bind:editor value={query} {parameters} {setValue} />

  {#if error}
    <div class="error caption c-red row">
      {error}
      <button class="close btn mrg-m mrg--l" on:click={() => (error = '')}>
        <Svg id="cross" w="12" />
      </button>
    </div>
  {/if}

  <iframe title="resizer" frameBorder="0" bind:this={iframe} />
</div>

<style>
  .editor {
    min-height: 284px;
    overflow: auto;
    resize: vertical;
    max-height: 80vh;
  }

  .error {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px;
    background: var(--red-light-1);
    color: var(--red);
    width: 100%;
  }

  .close {
    --fill: var(--waterloo);
    align-self: flex-start;
  }

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    top: 0;
  }
</style>
