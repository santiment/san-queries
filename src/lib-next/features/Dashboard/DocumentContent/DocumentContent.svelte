<script lang="ts">
  import { BROWSER } from 'esm-env'

  import Editor from 'tiptap-svelte-adapter'
  import BlockActions from '$lib/DashboardNext/BlockEditor/extensions/BlockActions/index.svelte'
  import BubbleMenu from '$lib/DashboardNext/BlockEditor/extensions/BubbleMenu/index.svelte'

  import { getBaseExtensions } from './extensions'

  import { useDashboardCtx } from '../ctx'
  import SSR from '$lib/DashboardNext/BlockEditor/SSR.svelte'
  import Placeholder from '$lib/DashboardNext/BlockEditor/extensions/Placeholder'
  import TrailingNode from '$lib/DashboardNext/BlockEditor/extensions/TrailingNode'
  import SlashCommands from '$lib/DashboardNext/BlockEditor/extensions/SlashCommands'

  const { dashboard, dashboardDocument } = useDashboardCtx.get()

  const { isEditable, isReadonly } = dashboard

  // @ts-ignore
  let content = dashboardDocument.documentContent

  console.log({ content })
</script>

<section class="flex-1 column" class:readonly={isReadonly}>
  {#if BROWSER}
    <Editor
      options={{
        editable: isEditable,

        content,
        // editorProps,

        extensions: getBaseExtensions().concat(
          isEditable ? [Placeholder, TrailingNode, SlashCommands] : [],
        ),

        // onUpdate,
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
