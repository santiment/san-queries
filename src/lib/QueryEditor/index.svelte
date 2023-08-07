<script lang="ts">
  // import Svg from 'webkit/ui/Svg/svelte'
  import ScreenControls from './ScreenControls.svelte'
  import SQLEditor from '$lib/SQLEditor/index.svelte'
</script>

<tabs class="row gap-l mrg-xxl mrg--l">
  <tab class="btn active">Editor</tab>
  <tab class="btn">Visualisation</tab>
</tabs>

<section class="column gap-s">
  <ScreenControls />

  <SQLEditor />
</section>

<style>
  tab {
    border-bottom: 1px solid transparent;
    border-radius: 0;
    padding: 0 0 7px;
  }

  .active {
    --color: var(--green);
    border-bottom-color: var(--green);
  }

  section {
    border-radius: 6px;
    padding: 20px 24px;
    background: var(--athens);
    flex: 1;
  }

  SQLEditor {
    --border-radius: 6px;
  }
</style>
