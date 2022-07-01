<script>
  export let title
  export let placeholder
  export let value
</script>

<div class="caption txt-m c-waterloo mrg-xs mrg--b">{title}</div>
<input bind:value type="text" class="input fluid mrg-xl mrg--b" {placeholder} />
