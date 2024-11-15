<script lang="ts">
  import { Dashboard } from '$lib-next/dashboard'

  let { data } = $props()
</script>

{#key data.apiDashboard?.id}
  <Dashboard readonly={true} apiDashboard={data.apiDashboard} cache={data.dashboardDataCache}
  ></Dashboard>
{/key}
