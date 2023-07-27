<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Search from 'webkit/ui/Search.svelte'
  import MyCredits from './MyCredits.svelte'
  import { TABS } from './tabs'

  export let tab = TABS[0] as (typeof TABS)[number]

  let scrollNode: HTMLElement

  function slideIn(node: HTMLElement) {
    node.classList.add('$style.in')
    scrollNode.style.overflow = 'hidden'
    return { duration: 300 }
  }

  function slideOut(node: HTMLElement) {
    node.classList.add('$style.out')
    return { duration: 300 }
  }

  function onTabClick(item: (typeof TABS)[number]) {
    const isNewTab = tab !== item

    scrollNode.scroll({ top: 0, behavior: isNewTab ? undefined : 'smooth' })

    if (isNewTab) tab = item
  }
</script>

<aside class="column">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <tabs class="row gap-s mrg-l mrg--b">
    {#each TABS as item}
      {@const {
        title,
        icon: [id, w, h],
      } = item}
      <tab class="btn" class:active={tab === item} on:click={() => onTabClick(item)}>
        <Svg {id} {w} {h} />
        {title}
      </tab>
    {/each}
  </tabs>

  <Search placeholder="Search for tables, metrics, functions" />

  <section bind:this={scrollNode} class="column relative">
    {#key tab}
      <main
        class="slide"
        in:slideIn
        out:slideOut
        on:introend={() => (scrollNode.style.overflow = '')}
      >
        <svelte:component this={tab.Component} />
      </main>
    {/key}
  </section>

  <MyCredits />
</aside>

<style lang="scss">
  aside {
    width: 348px;
    background: var(--athens);
    padding: 24px 24px 0;
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
  }

  .slide {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 24px 24px 24px 0;
  }

  .in {
    animation: slideIn 300ms;
  }

  .out {
    animation: slideOut 300ms;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes slideOut {
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
</style>
