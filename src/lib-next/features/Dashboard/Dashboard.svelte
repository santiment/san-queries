<script lang="ts">
  import { useDashboardCtx } from './ctx'
  import Header from './Header/Header.svelte'

  type TProps = { apiDashboard: undefined | null | App.ApiDashboard; readonly?: boolean }
  let { apiDashboard, readonly = true }: TProps = $props()

  const ctx = useDashboardCtx(apiDashboard, readonly)
  console.log(ctx)
</script>

<article class="flex-1 p-6 px-12 pb-20 column">
  <Header></Header>
</article>
