<script lang="ts">
  import Change, { formatPercentChange } from 'webkit/ui/Change.svelte'

  let className = ''
  export { className as class }
  export let value: number | string
</script>

<Change class={className} change={formatPercentChange(+value * 100)} />
