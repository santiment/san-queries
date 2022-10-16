<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import SQLEditor from '@/SQLEditor/Async.svelte'
  import { updateThemeParameters } from '@/SQLEditor/theme'

  export let panel
  export let editor
  export let error = ''
  export let controller

  controller.setValue = setValue

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
</script>

<div class="query border mrg-l mrg--b relative">
  <SQLEditor bind:editor value={query} {parameters} {setValue} />

  {#if error}
    <div class="error caption c-red row">
      {error}
      <button class="close btn mrg-m mrg--l" on:click={() => (error = '')}>
        <Svg id="cross" w="12" />
      </button>
    </div>
  {/if}
</div>

<style>
  .query {
    min-height: 284px;
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
</style>
