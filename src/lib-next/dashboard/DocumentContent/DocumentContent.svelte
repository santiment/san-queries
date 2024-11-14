<script lang="ts">
  import { BROWSER } from 'esm-env'

  import { onMount } from 'svelte'
  import Editor from 'tiptap-svelte-adapter'
  import BlockActions from '$lib/DashboardNext/BlockEditor/extensions/BlockActions/index.svelte'
  import BubbleMenu from '$lib/DashboardNext/BlockEditor/extensions/BubbleMenu/index.svelte'
  import SSR from '$lib/DashboardNext/BlockEditor/SSR.svelte'
  import Placeholder from '$lib/DashboardNext/BlockEditor/extensions/Placeholder'
  import TrailingNode from '$lib/DashboardNext/BlockEditor/extensions/TrailingNode'
  import SlashCommands from '$lib/DashboardNext/BlockEditor/extensions/SlashCommands'
  import { getBaseExtensions } from './extensions'
  import { useDashboardCtx } from '../ctx'

  type TProps = { onclickcapture?: (e: MouseEvent) => void; onUpdate: () => void }

  let { onUpdate, ...rest }: TProps = $props()

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
        // editorProps,

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
