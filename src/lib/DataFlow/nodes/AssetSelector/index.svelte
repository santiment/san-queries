<script lang="ts">
  import GenericHandle from '../GenericNode/Handle.svelte'
  import { useObservable } from 'svelte-runes'

  let { instance } = $props()

  const state = useObservable(instance.state$)
</script>

<div class="relative p-1">
  {state.$?.slug}

  <GenericHandle id="slug" type="output" />
</div>
