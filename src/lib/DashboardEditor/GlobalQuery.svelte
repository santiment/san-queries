<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import Parameter, { COLORS } from '$lib/Parameter'
  import { parseQueryParameters } from '$routes/(editor)/query/ctx'

  export let widget: any
  export let overrides = {}

  $: parameters = parseQueryParameters(widget.query.sqlQueryParameters)

  function onToggle(parameter) {
    let query = overrides[widget.id]
    if (!query) query = overrides[widget.id] = {}

    if (query[parameter.key]) delete query[parameter.key]
    else query[parameter.key] = true

    overrides = overrides
  }
</script>

<query class="column gap-s">
  <h4 class="row gap-s v-center caption c-waterloo">
    <Svg id="query" w="12" />

    {widget.title}
  </h4>

  <parameters class="row gap-xl">
    {#each parameters as parameter, i}
      <query-parameter class="row v-center gap-s">
        <Checkbox
          isActive={overrides[widget.id]?.[parameter.key]}
          on:click={() => onToggle(parameter)}
        />

        <Parameter {parameter} color={COLORS[i]} />
      </query-parameter>
    {/each}
  </parameters>
</query>

<style>
  h4 {
    fill: var(--waterloo);
  }

  parameters {
    flex-wrap: wrap;
    row-gap: 8px;
  }
</style>
