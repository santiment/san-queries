<script lang="ts">
  import { startLinksListener } from 'webkit/analytics/links'
  import { BROWSER } from 'esm-env'

  if (BROWSER) {
    startLinksListener()
  }
</script>
