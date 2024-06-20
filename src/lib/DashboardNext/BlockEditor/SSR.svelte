<script lang="ts">
  import type { JSONContent } from '@tiptap/core'

  import { getAllContexts } from 'svelte'
  import { generateHTML } from '@tiptap/html'
  import { getExtensions } from './extensions'

  let { content }: { content: JSONContent } = $props()

  const CTX = getAllContexts()

  function renderHtml() {
    try {
      return generateHTML(content, getExtensions(CTX))
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
