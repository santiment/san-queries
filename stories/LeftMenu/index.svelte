<script>
  import Component from '$lib/LeftMenu/index.svelte'
  import { TABS } from '$lib/LeftMenu/tabs'

  export let tab = 0
</script>

<Component tab={TABS[tab]} />

<style>
  Component {
    flex: 1;
  }
</style>
