<script lang="ts">
  import type { SS } from 'svelte-runes'

  import { BROWSER } from 'esm-env'
  import Parameter from '$lib/ui/Parameter'

  type TProps = {
    localParameters: Record<string, any>
    parameterOverrides: SS<Record<string, undefined | any>>
    dirtyParametersMap: Map<string, null | string>
  }
  let { localParameters, parameterOverrides, dirtyParametersMap }: TProps = $props()

  const parameters = Object.keys(localParameters).map((key) => ({
    key,
    value: localParameters[key],
  }))
</script>

<section class="flex flex-wrap gap-2 px-3 pb-3">
  {#each parameters as parameter}
    {@const { key } = parameter}
    {@const globalValue = parameterOverrides.$[key]}

    <Parameter
      global={globalValue}
      {parameter}
      value={globalValue}
      changed={BROWSER && !!dirtyParametersMap.get(key)}
    ></Parameter>
  {/each}
</section>
