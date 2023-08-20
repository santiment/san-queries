<script>
  import { getContext } from 'svelte'
  import Component from '$lib/DashboardEditor/AddQueryToDashboardDialog/index.svelte'

  const Dialog = getContext('Dialog')
</script>

<Dialog render={Component} onQueryAdd={console.log} />

<style>
</style>
