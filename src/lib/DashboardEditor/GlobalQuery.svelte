<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import Parameter, { COLORS } from '$lib/Parameter'
  import { parseQueryParameters } from '$routes/(editor)/query/ctx'

  export let widget: any

  $: parameters = parseQueryParameters(widget.query.sqlQueryParameters)
</script>

<query class="column gap-s">
  <h4 class="row gap-s v-center caption c-waterloo">
    <Svg id="query" w="12" />

    {widget.title}
  </h4>

  <parameters class="row gap-xl">
    {#each parameters as parameter, i}
      <query-parameter class="row v-center gap-s">
        <Checkbox />

        <Parameter {parameter} color={COLORS[i]} />
      </query-parameter>
    {/each}
  </parameters>
</query>

<style>
  h4 {
    fill: var(--waterloo);
  }
</style>
