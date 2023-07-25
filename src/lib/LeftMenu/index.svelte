<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Search from 'webkit/ui/Search.svelte'
  import WorkTab from './Work/index.svelte'
</script>

<aside class="column">
  <tabs class="row gap-s mrg-l mrg--b">
    <tab class="btn" class:active={true}><Svg id="queries" w="16" /> Data</tab>
    <tab class="btn"><Svg id="folder" w="16" h="14" /> Work</tab>
    <tab class="btn"><Svg id="insight" w="14" h="16" /> Use cases</tab>
  </tabs>

  <Search placeholder="Search for tables, metrics, functions" />

  <section class="column">
    <WorkTab />
  </section>

  <div class="credits row justify">
    Credits left: 4567
    <button class="my-credits">My credits</button>
  </div>
</aside>

<style lang="scss">
  aside {
    width: 348px;
    background: var(--athens);
    padding: 0 24px;
    height: 100vh;
  }

  tabs {
    border-bottom: 1px solid var(--porcelain);
  }

  tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 0;
    position: relative;
  }

  .active {
    fill: var(--green);
    color: var(--green);

    &:after {
      display: block;
      content: '';
      position: absolute;
      bottom: -1px;
      height: 1px;
      left: 0;
      right: 0;
      background: var(--green);
    }
  }

  Search {
    margin: 0;
  }

  section {
    flex: 1;
    overflow: auto;
    margin-right: -24px;
    padding: 24px 24px 24px 0;
  }

  .credits {
    background: var(--porcelain);
    margin: 0 -24px;
    padding: 6px 24px;
  }

  .my-credits {
    padding: 0 10px;
  }
</style>
