<script>
  export let title
  export let name
  export let placeholder = undefined
  export let value
  export let required = false
</script>

<div class="caption txt-m c-waterloo mrg-xs mrg--b">{title}</div>
<slot classes="fluid mrg-xl mrg--b">
  <input bind:value {name} type="text" class="input fluid mrg-xl mrg--b" {placeholder} {required} />
</slot>
