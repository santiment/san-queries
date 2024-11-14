<script lang="ts">
  import { BROWSER } from 'esm-env'
  import OnlyOnDevice from 'san-webkit/lib/ui/OnlyOnDevice.svelte'
  import EditorSidebar from '$lib/EditorSidebar/index.svelte'
  import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'
  import SaveIndicator, { useSaveIndicatorCtx } from '$lib/SaveIndicator'

  const _editorSidebarCtx = useEditorSidebarCtx()

  useSaveIndicatorCtx.set()
</script>

{#if BROWSER}
  <SaveIndicator></SaveIndicator>
{/if}

<screen class="flex flex-1">
  <OnlyOnDevice desktop>
    <EditorSidebar />
  </OnlyOnDevice>

  <main class="flex min-w-0 flex-1 flex-col">
    <slot />
  </main>
</screen>
