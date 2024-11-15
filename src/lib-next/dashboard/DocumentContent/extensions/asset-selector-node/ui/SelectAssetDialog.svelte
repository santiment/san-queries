<script module>
  import Component from './SelectAssetDialog.svelte'

  export const showSelectAssetDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import { tap } from 'rxjs'
  import { useObserve } from 'svelte-runes'
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'
  import VirtualList from 'san-webkit-next/ui/app/VirtualList'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import Input from 'san-webkit-next/ui/core/Input'
  import Button from 'san-webkit-next/ui/core/Button'
  import { queryAllProjects, type TAsset } from '../api'

  type TProps = TDialogProps<TAsset> & { slugsByText?: string[] }
  let { Controller, slugsByText }: TProps = $props()

  let assets = $state.raw<TAsset[]>([])
  let searchTerm = $state('')

  let filtered = $derived(
    assets.filter((item) =>
      (item.name + item.ticker + item.slug).toLowerCase().includes(searchTerm),
    ),
  )

  function onAssetClick(asset: TAsset) {
    Controller.resolve(asset)
    Controller.close()
  }

  useObserve(() =>
    queryAllProjects()().pipe(
      tap((data) => {
        if (slugsByText?.length) {
          const slugs = new Set(slugsByText)
          assets = data.filter((item) => slugs.has(item.slug))
        } else {
          assets = data
        }
      }),
    ),
  )
</script>

<Dialog class="max-h-[480px] w-[500px] rounded-lg">
  <Input
    icon="search"
    iconSize="16"
    class="border-none [&>svg]:left-5"
    inputClass="p-4 pl-12 text-base"
    placeholder="Search for asset or address..."
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
