<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Parameter, { COLORS } from '$lib/Parameter'

  export let tab = 0
  export let parameters = [] as any[]
</script>

<header class="row justify gap-xl">
  <parameters class="row gap-s">
    <button class="parameter btn row v-center gap-s c-waterloo">
      <Svg id="braces" w="16" />
      Parameter
    </button>

    <button class="info btn-3 c-waterloo">
      <Svg id="info" w="12" />
    </button>

    {#each parameters as parameter, i}
      <Parameter {parameter} color={COLORS[i]} />
    {/each}
  </parameters>

  <actions class="row gap-s c-waterloo nowrap">
    {#if tab === 0}
      <button class="btn-3">
        <Svg id="report" w="16" />
      </button>
    {:else}
      <button class="btn-2">Add to dashboard</button>

      <button class="download btn row v-center gap-s">
        <Svg id="download" w="16" />

        CSV
      </button>
    {/if}

    <button class="btn-3">
      <Svg id="fullscreen" w="14" />
    </button>
  </actions>
</header>

<style>
  parameters {
    flex-wrap: wrap;
  }

  .parameter {
    padding: 6px 8px;
  }

  .info {
    margin: 0 8px 0 -8px;
  }

  .download {
    padding: 0 8px;
  }

  button {
    --color-hover: var(--green);
  }

  .btn-2 {
    --border: var(--green);
  }
</style>
