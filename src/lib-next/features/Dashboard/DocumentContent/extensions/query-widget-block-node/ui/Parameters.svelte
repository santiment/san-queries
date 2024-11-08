<script lang="ts">
  import Parameter from '$lib/ui/Parameter'
  import type { SS } from 'svelte-runes'

  type TProps = {
    localParameters: Record<string, any>
    parameterOverrides: SS<Record<string, undefined | any>>
    lastFetchedParameterValues: Record<string, any>
  }
  let { localParameters, parameterOverrides, lastFetchedParameterValues }: TProps = $props()

  const parameters = Object.keys(localParameters).map((key) => ({
    key,
    value: localParameters[key],
  }))
</script>

<section class="flex flex-wrap gap-2 px-3 pb-3">
  {#each parameters as parameter}
    {@const { key, value } = parameter}
    {@const globalValue = parameterOverrides.$[key]}

    <Parameter
      global={globalValue}
      {parameter}
      value={globalValue}
      changed={(globalValue || value) !== lastFetchedParameterValues[key]}
    ></Parameter>
  {/each}
</section>
