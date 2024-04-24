<script lang="ts">
  import type { Step } from './types'

  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import StepValue from '../StepValue.svelte'

  export let value: Step['value']

  $: ({ isPublic, channel } = value)
  $: channels = Object.keys(channel).filter((key) => channel[key as keyof typeof channel])
</script>

<StepValue>
  <Svg id="eye" w="16" />
  {isPublic ? 'Public' : 'Private'} alert
</StepValue>

{#if channels.length}
  <StepValue>
    {channels.join(', ')}
  </StepValue>
{/if}
