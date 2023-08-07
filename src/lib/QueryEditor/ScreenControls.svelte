<script>
  import Svg from 'webkit/ui/Svg/svelte'
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
  </parameters>

  <actions class="row gap-s c-waterloo">
    <button class="btn-2">Add to dashboard</button>

    <button class="download btn row v-center gap-s">
      <Svg id="download" w="16" />

      CSV
    </button>

    <button class="btn-3">
      <Svg id="fullscreen" w="14" />
    </button>
  </actions>
</header>

<style>
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
</style>
