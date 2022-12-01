<script lang="ts">import { onMount } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import SQLEditor from './../../../lib/SQLEditor/Async.svelte';
import { updateThemeParameters } from './../../../lib/SQLEditor/theme';
export let panel;
export let editor;
export let error = '';
export let controller;
controller.setValue = setValue;
let iframe;
let isFocused = false;

$: ({
  query,
  parameters
} = panel.sql);

$: if (editor) {
  editor.onDidBlurEditorText(onBlur);
  editor.onDidFocusEditorWidget(onFocus);
}

$: updateThemeParameters(parameters);

function onBlur() {
  panel.sql.query = editor.getValue();
  isFocused = false;
}

function onFocus() {
  isFocused = true;
}

function setValue(value) {
  editor.setValue(value);
  panel.sql.query = value;
}

function onResize() {
  if (editor) {
    const {
      offsetWidth: width,
      offsetHeight: height
    } = iframe;
    editor.layout({
      width,
      height
    });
  }
}

onMount(() => {
  if (iframe.contentWindow) iframe.contentWindow.onresize = onResize;
});</script>

<div class="editor border relative">
  <SQLEditor bind:editor value={query} {parameters} {setValue}>
    {#if !panel.sql.query && !isFocused}
      <div class="placeholder c-green">Write your SQL here...</div>
    {/if}
  </SQLEditor>

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
    flex: 1;
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

  .placeholder {
    position: absolute;
    left: 62px;
    top: 14px;
    pointer-events: none;
  }
</style>
