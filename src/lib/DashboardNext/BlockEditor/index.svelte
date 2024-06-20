<script lang="ts">
  import type { EditorOptions, JSONContent } from '@tiptap/core'

  import { BROWSER } from 'esm-env'
  import Editor from 'tiptap-svelte-adapter'

  import TrailingNode from './extensions/TrailingNode'
  import Placeholder from './extensions/Placeholder'
  import SlashCommands from './extensions/SlashCommands'
  import BlockActions from './extensions/BlockActions/index.svelte'
  import BubbleMenu from './extensions/BubbleMenu/index.svelte'

  import { getExtensions } from './extensions'
  import SSR from './SSR.svelte'

  let {
    readonly = true,
    content,
    editorProps,
  }: {
    readonly?: boolean
    content: JSONContent
    editorProps?: EditorOptions['editorProps'] & Record<string, any>
  } = $props()

  let EditorRef: Editor

  export function getEditor() {
    return EditorRef?.getEditor()
  }
</script>

<div class="flex-1 column">
  {#if BROWSER}
    <Editor
      bind:this={EditorRef}
      options={{
        editable: !readonly,

        content,
        editorProps,

        extensions: [...getExtensions(), Placeholder, TrailingNode, SlashCommands],
      }}
    >
      {#if !readonly}
        <BubbleMenu></BubbleMenu>
        <BlockActions></BlockActions>
      {/if}
    </Editor>
  {:else}
    <SSR {content}></SSR>
  {/if}
</div>

<style>
  div :global {
    & > article {
      display: contents;
    }

    .hide {
      @apply hidden;
    }

    .tiptap {
      @apply -mx-12 -mt-4 flex flex-1 flex-col p-6 px-12 pb-20 outline-none;
    }

    h1:not(.svelte-renderer *) {
      @apply text-2xl;
    }

    h2:not(.svelte-renderer *) {
      @apply text-xl;
    }

    h3:not(.svelte-renderer *) {
      @apply text-lg;
    }

    h4:not(.svelte-renderer *) {
      @apply text-base;
    }

    [data-type='paragraph']:not(.svelte-renderer *) {
      @apply py-0.5 text-base;
    }
    a:not(.svelte-renderer *) {
      @apply text-green;
    }

    [data-type='columns'] {
      gap: 16px;
      display: flex;
    }

    [data-type='column'] {
      position: relative;
      min-width: 0;

      flex: 6;
      transition: flex-grow 180ms ease;

      &:last-child > [data-type='column-resizer'] {
        display: none;
      }
    }

    [data-type='column-resizer'] {
      position: absolute;
      top: -7px;
      bottom: -7px;
      right: -12px;
      width: 6px;
      border-radius: 8px;
      background: #c8c8c8;
      opacity: 0.3;

      cursor: col-resize;
      z-index: 100;

      &:hover {
        opacity: 1;
      }
    }

    .is-empty::before,
    .is-empty::before,
    .is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: var(--casper);
      pointer-events: none;
      height: 0;
    }

    .tiptap :not(.svelte-renderer *):not([data-type='column-resizer']),
    .svelte-renderer {
      position: relative;
    }

    :not(.dragging) .ProseMirror-selectednode::after {
      display: block;
      content: '';
      position: absolute;
      pointer-events: none;
      inset: 0px;
      background: rgba(35, 131, 226, 0.14);
      z-index: 51;
      border-radius: 4px;
      opacity: 1;
      transition-property: opacity;
      transition-duration: 200ms;
      transition-timing-function: ease;
    }
  }
</style>
