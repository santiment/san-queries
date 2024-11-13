<script lang="ts">
  import Dashboard from '$lib-next/features/Dashboard'

  let { data } = $props()
</script>

{#key data.apiDashboard?.id}
  <Dashboard readonly={true} apiDashboard={data.apiDashboard} cache={data.dashboardDataCache}
  ></Dashboard>
{/key}
