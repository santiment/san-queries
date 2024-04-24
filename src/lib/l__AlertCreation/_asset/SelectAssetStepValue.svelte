<script lang="ts">
  import type { Value } from './types'

  import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte'
  import StepValue from '../StepValue.svelte'

  export let value: Value

  const MAX = 3

  $: assets = value.target
  $: visible = assets.slice(0, MAX)
</script>

{#each visible as asset}
  <StepValue>
    <ProjectIcon {...asset} size={16} />

    {asset.ticker}
  </StepValue>
{/each}

{#if assets.length > MAX}
  <StepValue>
    +{assets.length - MAX}
  </StepValue>
{/if}
