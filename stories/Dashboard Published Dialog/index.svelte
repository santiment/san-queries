<script>
  import { getContext } from 'svelte'
  import Component from '$lib/DashboardPublishedDialog/index.svelte'

  const Dialog = getContext('Dialog')
</script>

<Dialog render={Component} />

<style>
</style>
