<script lang="ts">
  import StarterKit from '@tiptap/starter-kit'
  import Editor from 'tiptap-svelte-adapter'
  import { Color } from '@tiptap/extension-color'
  import Highlight from '@tiptap/extension-highlight'
  import Underline from '@tiptap/extension-underline'
  import TextStyle from '@tiptap/extension-text-style'
  import Link from '@tiptap/extension-link'

  // import BlockLayout, { Column, Columns } from 'tiptap-block-layout'
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
      ],
    }}
  >
    <BubbleMenu></BubbleMenu>
  </Editor>
</div>

<style>
  div :global {
    & > article {
      display: contents;
    }

    .tiptap {
      @apply -mx-12 -mt-4 flex flex-1 flex-col p-6 px-12 pb-20 outline-none;
    }

    a {
      color: var(--green);
    }
  }
</style>
