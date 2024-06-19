<script lang="ts">
  import StarterKit from '@tiptap/starter-kit'
  import Editor from 'tiptap-svelte-adapter'
  import { Color } from '@tiptap/extension-color'
  import Highlight from '@tiptap/extension-highlight'
  import Underline from '@tiptap/extension-underline'
  import TextStyle from '@tiptap/extension-text-style'
  import Link from '@tiptap/extension-link'
  import BlockLayout, { Column, Columns } from 'tiptap-block-layout'

  import BlockActions from './extensions/BlockActions/index.svelte'
  import BubbleMenu from './extensions/BubbleMenu/index.svelte'

  let { readonly = true, content = '' } = $props()

  let EditorRef: Editor

  export function getEditor() {
    return EditorRef?.getEditor()
  }
</script>

<div class="flex-1 column">
  <Editor
    bind:this={EditorRef}
    options={{
      editable: !readonly,

      content,

      extensions: [
        StarterKit.configure({
          dropcursor: false,
          gapcursor: false,
        }),
        Link.configure({ openOnClick: false }),
        Underline,
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),

        Columns,
        Column,
        BlockLayout.configure({ dropareaColor: 'var(--droparea-color)' }),
      ],
    }}
  >
    <BubbleMenu></BubbleMenu>
    <BlockActions></BlockActions>
  </Editor>
</div>

<style lang="postcss">
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

    p:not(.svelte-renderer *) {
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
  }
</style>
