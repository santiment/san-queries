<script module>
  import Component from './SelectAssetDialog.svelte'

  export const showSelectAssetDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import { useAssetsCtx, type TAsset } from 'san-webkit-next/ctx/assets'
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'
  import VirtualList from 'san-webkit-next/ui/app/VirtualList'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import Input from 'san-webkit-next/ui/core/Input'
  import Button from 'san-webkit-next/ui/core/Button'

  type TProps = TDialogProps<TAsset> & { slugsByText?: string[] }
  let { Controller, slugsByText }: TProps = $props()

  const { assets: allAssets } = useAssetsCtx.get()

  const slugs = new Set(slugsByText)

  let searchTerm = $state('')

  const assets = $derived(slugs.size ? allAssets.$.filter(strictListFilter) : allAssets.$)
  const filtered = $derived(
    assets.filter((item) =>
      (item.name + item.ticker + item.slug).toLowerCase().includes(searchTerm),
    ),
  )

  function onAssetClick(asset: TAsset) {
    Controller.resolve(asset)
    Controller.close()
  }

  function strictListFilter(item: TAsset) {
    return slugs.has(item.slug)
  }
</script>

<Dialog class="max-h-[480px] w-[500px] rounded-lg">
  <Input
    icon="search"
    iconSize="16"
    class="border-none [&>svg]:left-5"
    inputClass="p-4 pl-12 text-base"
    placeholder="Search for an asset..."
    oninput={(e) => (searchTerm = e.currentTarget.value.trim())}
  ></Input>

  <VirtualList
    class="min-h-[300px] flex-1 px-6"
    maxHeight={300}
    itemHeight={48}
    data={filtered}
    getKey={(item) => item.slug}
  >
    {#snippet children(item)}
      <Button
        variant="ghost"
        class="w-full gap-2 whitespace-nowrap rounded p-2"
        onclick={() => onAssetClick(item)}
      >
        <AssetLogo class="size-8" slug={item.slug}></AssetLogo>
        <span>
          {item.name}
        </span>
        <span class="text-waterloo">({item.ticker})</span>
      </Button>
    {/snippet}
  </VirtualList>
</Dialog>
