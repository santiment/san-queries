<script lang="ts">
  // import type { StepType } from './types'

  import Metrics from './Metrics.svelte'
  import Metric from './Metric.svelte'
  import Conditions from './Conditions.svelte'

  // export let step: StepType
  export let step: any
  export let category: any

  step.next = null
  const { target } = category.alert

  let isMetricScreen = !step.value.metric

  function selectMetric(metric?: any) {
    if (metric) {
      step.value.metric = metric
      step.valid = true
    }

    isMetricScreen = !metric

    step.next = metric
      ? null
      : {
          label: 'Conditions',
          onClick: () => {
            isMetricScreen = false
            step.next = null
          },
        }
  }
</script>

{#if isMetricScreen}
  <Metrics
    slugs={(Array.isArray(target) ? target : [target]).map(({ slug }) => slug)}
    metric={step.value.metric}
    {selectMetric}
  />
{:else if step.value.metric}
  <Conditions bind:conditions={step.value.conditions} metric={step.value.metric}>
    <Metric metric={step.value.metric} onClick={() => selectMetric()} />
  </Conditions>
{/if}
