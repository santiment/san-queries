<script lang="ts">
  import type { PageData } from './$types'

  import Layout from '../Layout.svelte'

  export let data: PageData
</script>

<Layout apiQuery={data.apiQuery} />

<style>
</style>
