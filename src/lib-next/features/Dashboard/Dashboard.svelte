<script lang="ts">
  import { useDashboardCtx } from './ctx'

  type TProps = { apiDashboard: undefined | null | App.ApiDashboard; readonly?: boolean }
  let { apiDashboard, readonly = true }: TProps = $props()

  const ctx = useDashboardCtx(apiDashboard, readonly)
  console.log(ctx)
</script>
