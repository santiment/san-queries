<script lang="ts">
  import { BROWSER } from 'esm-env'

  import Editor from 'tiptap-svelte-adapter'
  import BlockActions from '$lib/Dashboardnext/BlockEditor/extensions/BlockActions/index.svelte'
  import BubbleMenu from '$lib/Dashboardnext/BlockEditor/extensions/BubbleMenu/index.svelte'

  import { getBaseExtensions } from './extensions'
  import { useDashboardCtx } from '../ctx'

  const { dashboard } = useDashboardCtx.get()

  const { isEditable, apiDashboard } = dashboard

  // @ts-ignore
  let content = apiDashboard?.settings.__editorJson || []

  console.log({ content })
</script>

<section class="flex-1 column">
  {#if BROWSER}
    <Editor
      options={{
        editable: isEditable,

        content,
        // editorProps,

        extensions: getBaseExtensions().concat(
          [],
          // isEditable ? [] : [Placeholder, TrailingNode, SlashCommands],
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
    <!-- SSR Content -->
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
</style>
