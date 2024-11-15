<script lang="ts">
  import type { JSONContent } from '@tiptap/core'

  import { getAllContexts } from 'svelte'
  import { generateHTML } from '@tiptap/html'
  import { getBaseExtensions } from '$lib-next/dashboard/DocumentContent/extensions'

  let { content }: { content: JSONContent } = $props()

  const CTX = getAllContexts()

  function renderHtml() {
    try {
      return generateHTML(content, getBaseExtensions(CTX))
    } catch (e) {
      console.error(e)
      return ''
    }
  }
</script>

<article>
  <div class="tiptap">
    {@html renderHtml()}
  </div>
</article>
