<script>
  import { newChartColors } from 'studio/Chart/colors'
  import Parameter from './Parameter.svelte'

  const parameters = [0, 1, 2, 3, 4].map((v) => ({ key: v }))

  $: colors = newChartColors(parameters)
</script>

{#each parameters as parameter}
  <Parameter color={colors[parameter.key]} />
{/each}
