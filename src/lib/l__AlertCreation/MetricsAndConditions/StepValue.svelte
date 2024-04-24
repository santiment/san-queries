<script lang="ts">
  import type { StepType } from './types'

  import { describe } from './utils'
  import StepValue from '../StepValue.svelte'

  export let value: StepType['value']

  $: ({ metric, conditions } = value)
</script>

<StepValue>
  {metric && metric.label}
</StepValue>

{describe(metric, conditions)}
