<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { useDashboardCtx } from '../../ctx'

  type TProps = { onclick: () => void }
  let { onclick }: TProps = $props()

  const { dashboard } = useDashboardCtx.get()
</script>

{#if dashboard.isEditable}
  <button class="ml-2 cursor-pointer fill-waterloo hover:fill-green" {onclick}>
    <Svg id="cog" w="12"></Svg>
  </button>
{/if}
