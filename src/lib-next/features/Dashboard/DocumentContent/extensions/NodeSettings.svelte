<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'
  import { useDashboardCtx } from '../../ctx'

  type TProps = { class?: string; onclick: () => void }
  let { class: className, onclick }: TProps = $props()

  const { dashboard } = useDashboardCtx.get()
</script>

{#if dashboard.isEditable}
  <button class={cn('ml-2 cursor-pointer fill-waterloo hover:fill-green', className)} {onclick}>
    <Svg id="cog" w="12"></Svg>
  </button>
{/if}
