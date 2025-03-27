<script lang="ts">
  import { BROWSER } from 'esm-env'
  import OnlyOnDevice from 'san-webkit-next/ui/utils/OnlyOnDevice'
  import EditorSidebar from '$lib/EditorSidebar/index.svelte'
  import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
  import SaveIndicator, { useSaveIndicatorCtx } from '$lib/SaveIndicator'
  import { checkIsDyorDashboard } from '$lib-next/utils/index'

  const _editorSidebarCtx = useEditorSidebarCtx()

  useSaveIndicatorCtx.set()

  const isDyorDashboardPage = $derived(checkIsDyorDashboard())
</script>

<screen class="flex flex-1">
  {#if !isDyorDashboardPage}
    <OnlyOnDevice desktop>
      <EditorSidebar />
    </OnlyOnDevice>
  {/if}

  <main class="flex min-w-0 flex-1 flex-col">
    <slot />
  </main>
</screen>

{#if BROWSER}
  <SaveIndicator></SaveIndicator>
{/if}

<style lang="postcss">
  :global(#dialogs) :global {
    input[readonly] {
      flex: 1;
    }

    .btn-3 {
      @apply inline-flex center;
    }

    .mrg-xl.mrg--b {
      @apply mb-6;
    }
  }
</style>
