<script lang="ts">
  export let sign: '' | '%' | '$'
  export let value: number
</script>

<label class="input border row">
  {#if sign}<span class="c-casper mrg-xs mrg--r">{sign}</span>{/if}

  <input bind:value type="number" class="fluid" />
</label>
