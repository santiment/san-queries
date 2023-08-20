<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tabs from 'webkit/ui/Tabs'
  import Search from 'webkit/ui/Search.svelte'
  import MyCredits from './MyCredits.svelte'
  import { TABS } from './tabs'

  let className = ''
  export { className as class }
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

<aside class="column {className}">
  <Tabs class="gap-s mrg-l mrg--b" tabs={TABS} selected={tab} onSelect={onTabClick} let:item>
    {@const {
      title,
      icon: [id, w, h],
    } = item}
    <Svg {id} {w} {h} />
    {title}

    <svelte:fragment slot="after">
      <button class="btn mrg-a mrg--l">
        <Svg id="collapse" w="12" />
      </button>
    </svelte:fragment>
  </Tabs>

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
    max-height: 100vh;
    position: sticky;
    top: 0;
  }

  Tabs {
    border-bottom: 1px solid var(--porcelain);
    --tab-padding: 6px 8px;
    --underline-bottom: -1px;
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
