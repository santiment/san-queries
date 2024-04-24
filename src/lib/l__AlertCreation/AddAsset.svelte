<script lang="ts">
  import VirtualList from 'san-webkit/lib/ui/VirtualList/index.svelte'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte'
  import Search from 'san-webkit/lib/ui/Search.svelte'
  import { debounce$$ } from 'san-webkit/lib/utils/fn'

  export let assets = [] as any[]
  export let onSelect: (asset: any) => void

  let searchTerm = ''
  let isOpened = false

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }: Event) =>
    $onSearch$((currentTarget as HTMLInputElement).value)

  $: filtered = searchTerm ? filter(assets) : assets

  const match = (value: string, target: null | string) =>
    (target || '').toLowerCase().includes(value)
  const matchAsset = (value: string, { slug, ticker, name }: any) =>
    match(value, slug) || match(value, ticker) || match(value, name)

  function filter(items: any[]) {
    const value = searchTerm.toLowerCase()
    return items.filter((item) => matchAsset(value, item))
  }
</script>

<Tooltip on="click" duration={0} class="block bg-white p-2" bind:isOpened>
  <svelte:fragment slot="trigger">
    <slot>
      <button class="btn-2 btn--s row v-center mrg-a mrg--r" class:disabled={assets.length === 0}>
        <Svg id="plus" w="8" />
        Add assets
      </button>
    </slot>
  </svelte:fragment>

  <svelte:fragment slot="tooltip">
    <Search class="mrg-s mrg--b" autofocus placeholder="Search assets" on:input={onInput} />

    <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={335} items={filtered} let:item>
      {@const { name, ticker } = item}
      <button class="row v-center btn-ghost" on:click={() => onSelect(item)}>
        {name} ({ticker})
      </button>
    </VirtualList>
  </svelte:fragment>
</Tooltip>

<style>
  button {
    gap: 8px;
    --bg: var(--white);
  }
</style>
