<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tabs from 'webkit/ui/Tabs'
  import Search, { Search$$ } from './Search.svelte'
  import MyCredits from './MyCredits.svelte'
  import { TABS } from './tabs'
  import { track } from 'webkit/analytics'

  let className = ''
  export { className as class }
  export let tab = TABS[1] as (typeof TABS)[number]

  const { search$ } = Search$$()

  let asideNode: HTMLElement
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

    if (isNewTab) {
      track.event('left_menu_tab_select', {
        category: 'Interaction',
        tab: item.title,
        old_tab: tab.title,
      })

      tab = item
      search$.set('')

      const inputNode = asideNode.querySelector('.search input') as null | HTMLInputElement
      if (inputNode) inputNode.value = ''
    }
  }
</script>

<aside bind:this={asideNode} class="column {className}">
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

  <Search {tab} />

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
    z-index: 1;
  }

  Tabs {
    border-bottom: 1px solid var(--porcelain);
    --tab-padding: 6px 8px;
    --underline-bottom: -1px;
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
