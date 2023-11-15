<script lang="ts">
  import type { PageData } from './$types'

  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { DashboardHead } from '$lib/EntityHead'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'

  // const { currentUser$ } = getCurrentUser$Ctx()
  export let data: PageData

  const { currentUser$ } = getCurrentUser$Ctx()

  $: console.log(data)
</script>

<main class="column">
  <DashboardHead author={$currentUser$} />

  <DashboardEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }

  DashboardEditor {
    padding-top: 0 !important;
  }
</style>
