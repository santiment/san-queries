<script lang="ts">
  import OnlyOnDevice from 'san-webkit/lib/ui/OnlyOnDevice.svelte'
  import EditorSidebar from '$lib/EditorSidebar/index.svelte'
    import { useEditorSidebarCtx } from '$lib/EditorSidebar/ctx'


  const _editorSidebarCtx = useEditorSidebarCtx()
</script>

<screen class="flex flex-1">
  <OnlyOnDevice desktop>
    <EditorSidebar />
  </OnlyOnDevice>

  <main class="flex min-w-0 flex-1 flex-col">
    <slot />
  </main>
</screen>
