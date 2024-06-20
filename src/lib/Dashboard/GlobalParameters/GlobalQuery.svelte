<script lang="ts">
  import type { OverridesDiff } from './utils'
  import Checkbox from '$lib/ui/Checkbox'
  import Parameter from '$lib/ui/Parameter'
  import Svg from 'san-webkit-next/ui/core/Svg'

  let {
    widget,
    overridesDiff,
  }: { widget: App.Dashboard.QueryWidget; overridesDiff: OverridesDiff } = $props()

  let queryParameters = $derived(Object.keys(widget.data.sqlQueryParameters))

  function onToggle(parameter: string, isActive: boolean) {
    if (isActive) {
      overridesDiff.delete(widget.id, parameter)
    } else {
      overridesDiff.set(widget.id, parameter)
    }
  }
</script>

<query class="flex flex-col gap-2">
  <h4 class="flex items-center gap-2 fill-waterloo text-xs text-waterloo">
    <Svg id="query" w="12" />

    {widget.data.name}
  </h4>

  <parameters class="flex flex-wrap gap-6 gap-y-2">
    {#each queryParameters as parameter, i}
      {@const parameterKey = overridesDiff.get(widget.id, parameter)}
      {@const isActive = parameter === parameterKey}
      <query-parameter class="flex items-center gap-2">
        <Checkbox value={isActive} onclick={() => onToggle(parameter, isActive)} />

        <Parameter
          parameter={{ key: parameter, value: widget.data.sqlQueryParameters[parameter] }}
        />
      </query-parameter>
    {/each}
  </parameters>
</query>
