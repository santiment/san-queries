<script lang="ts">
  import type { EditorOptions } from '@tiptap/core'
  import { BROWSER } from 'esm-env'
  import { onMount } from 'svelte'
  import Editor from 'tiptap-svelte-adapter'
  import SSR from './SSR'
  import { getBaseExtensions } from './extensions'
  import BlockActions from './extensions/block-actions'
  import SlashCommands from './extensions/slash-commands'
  import TrailingNode from './extensions/trailing-node'
  import BubbleMenu from './extensions/bubble-menu'
  import Placeholder from './extensions/placeholder'
  import { useDashboardCtx } from '../ctx'

  type TProps = { onclickcapture?: (e: MouseEvent) => void; onUpdate: () => void } & {
    editorProps?: EditorOptions['editorProps'] & Record<string, any>
  }

  let { editorProps, onUpdate, ...rest }: TProps = $props()

  const { dashboard, dashboardDocument, documentEditor } = useDashboardCtx.get()

  const { isEditable, isReadonly } = dashboard
  const content = dashboardDocument.documentContent

  let EditorRef = $state<Editor>()

  onMount(() => {
    const editor = EditorRef?.getEditor()
    if (editor) documentEditor.$ = editor
  })
</script>

<section {...rest} class="flex-1 column" class:readonly={isReadonly}>
  {#if BROWSER}
    <Editor
      bind:this={EditorRef}
      options={{
        editable: isEditable,

        content,
        editorProps,

        extensions: getBaseExtensions().concat(
          isEditable ? [Placeholder, TrailingNode, SlashCommands] : [],
        ),

        onUpdate,
      }}
    >
      {#if isEditable}
        <BubbleMenu></BubbleMenu>
        <BlockActions></BlockActions>
      {/if}
    </Editor>
  {:else}
    <SSR {content}></SSR>
  {/if}
</section>

<style lang="postcss">
  section > :global(article) {
    display: contents;
  }
  section :global {
    @nested-import './main.css';

    @nested-import './headings.css';

    @nested-import './list.css';

    @nested-import './columns.css';
  }

  .readonly :global {
    [data-type='hidden-block'] {
      display: none;
    }
  }
</style>
