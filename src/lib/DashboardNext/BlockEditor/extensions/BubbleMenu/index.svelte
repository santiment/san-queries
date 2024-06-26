<script lang="ts">
  import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
  import { NodeSelection } from 'prosemirror-state'
  import { BubbleMenu, getEditorCtx } from 'tiptap-svelte-adapter'
  import {
    BoldIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    LinkIcon,
    ChevronDown,
  } from 'lucide-svelte'
  import 'tippy.js/animations/shift-toward-subtle.css'
  import ColorSelector from './ColorSelector.svelte'
  import LinkSelector from './LinkSelector.svelte'

  const editor = getEditorCtx()

  const shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor, state }) => {
    const { selection } = state
    const { empty } = selection

    if (empty || editor.isActive('image') || selection instanceof NodeSelection) {
      return false
    }

    return true
  }
</script>

<BubbleMenu
  class="inline-flex gap-0.5 rounded-sm border bg-white p-1 shadow"
  options={{
    shouldShow,

    tippyOptions: {
      duration: 200,
      animation: 'shift-toward-subtle',
    },
  }}
>
  <LinkSelector>
    {#snippet children({ ref })}
      <button bind:this={ref.$}>
        <LinkIcon size="16"></LinkIcon>
      </button>
    {/snippet}
  </LinkSelector>

  <button onclick={() => editor.chain().focus().toggleBold().run()}>
    <BoldIcon size="16"></BoldIcon>
  </button>

  <button onclick={() => editor.chain().focus().toggleItalic().run()}>
    <ItalicIcon size="16"></ItalicIcon>
  </button>

  <button onclick={() => editor.chain().focus().toggleUnderline().run()}>
    <UnderlineIcon size="16"></UnderlineIcon>
  </button>

  <button onclick={() => editor.chain().focus().toggleStrike().run()}>
    <StrikethroughIcon size="16"></StrikethroughIcon>
  </button>

  <ColorSelector>
    {#snippet children({ ref })}
      <button bind:this={ref.$} class="!w-auto gap-1 px-1.5">
        <span class="size-4 min-w-4 rounded-full bg-black"></span>
        <ChevronDown size="12" />
      </button>
    {/snippet}
  </ColorSelector>
</BubbleMenu>

<style>
  button {
    @apply inline-flex size-8 min-w-8 rounded-md fill-black center;
    @apply hover:bg-athens;
  }
</style>
