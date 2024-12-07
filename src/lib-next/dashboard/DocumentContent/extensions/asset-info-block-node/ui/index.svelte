<script lang="ts">
  import type { TDataWidgetProps } from '../../schema/data-widget'

  import type { Snippet } from 'svelte'
  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import type { ASSET_INFO_BLOCK_NODE, TField } from '../schema'
  import Note from '../../utils/Note.svelte'
  import { useDataWidgetParameterOverrides } from '$lib-next/dashboard/ctx/data-widgets.svelte'
  import { queryAssetInfo, type TAssetInfoData } from './api'
  import { useObserveFnCall } from 'san-webkit-next/utils'
  import { switchMap, tap } from 'rxjs'
  import PercentChange from '$lib/Visualization/format/PercentChange.svelte'
  import Checkbox from 'san-webkit-next/ui/core/Checkbox'
  import { formatUsd, millify } from 'san-webkit/lib/utils/formatting'

  let { data }: TDataWidgetProps<typeof ASSET_INFO_BLOCK_NODE> = $props()

  const { widget } = data
  const { id, settings } = widget

  const { parameterOverrides } = useDataWidgetParameterOverrides(id, widget.data.inputs)
  const { dashboard } = useDashboardCtx.get()

  let assetInfo = $state.raw<TAssetInfoData>({
    priceUsd: 0,
    marketcapUsd: 0,
    percentChange24h: '0',
    info: { summary: '' },
    tags: [],
  })

  const loadAssetInfo = useObserveFnCall<{ slug: string }>(() =>
    switchMap((variables) => queryAssetInfo()(variables).pipe(tap((data) => (assetInfo = data)))),
  )

  $effect(() => {
    loadAssetInfo((parameterOverrides.$ as any) || { slug: 'bitcoin' })
  })

  function toggleField(field: TField) {
    const fields = new Set(settings.$$.fields)
    if (fields.has(field)) fields.delete(field)
    else fields.add(field)

    widget.state.$$.fields = fields
    settings.$$.fields = Array.from(fields)
  }
</script>

{#if dashboard.isEditable}
  <div class="flex-1 gap-3 rounded border border-dashed border-blue p-3 column">
    <Note class="border-red bg-red-light-1 fill-red">
      This widget is unstable and might be removed soon
    </Note>

    {@render visibleControl({ field: 'price', children: price })}

    {@render visibleControl({ field: 'marketcap', children: marketcap })}

    {@render visibleControl({ field: 'description', children: description })}
  </div>
{:else}
  <section class="gap-2 column">
    {#if widget.state.$$.fields.has('price')}
      {@render price()}
    {/if}

    {#if widget.state.$$.fields.has('marketcap')}
      {@render marketcap()}
    {/if}

    {#if widget.state.$$.fields.has('description')}
      {@render description()}
    {/if}
  </section>
{/if}

{#snippet visibleControl({ field, children }: { field: TField; children: Snippet })}
  <div class="flex gap-3">
    <div class="flex gap-2 border-r pr-3 center">
      Show <Checkbox
        isActive={widget.state.$$.fields.has(field)}
        onCheckedChange={() => toggleField(field)}
      ></Checkbox>
    </div>

    <div class="gap-2 column">
      {@render children()}
    </div>
  </div>
{/snippet}

{#snippet price()}
  <div class="flex items-center gap-2">
    <span class="text-waterloo">Price</span>
    <span class="text-base">{formatUsd(assetInfo.priceUsd * 100)}</span>
    <PercentChange value={+assetInfo.percentChange24h / 100}></PercentChange>
  </div>
{/snippet}

{#snippet marketcap()}
  <div class="items-center gap-2 row">
    <span class="text-waterloo">Market cap</span>
    <span class="text-base">${millify(assetInfo.marketcapUsd)}</span>
  </div>
{/snippet}

{#snippet description()}
  <div class="text-fiord">
    {assetInfo.info?.summary || 'No summary found'}
  </div>

  {#if assetInfo.tags.length}
    <section class="flex flex-wrap gap-1 text-xs">
      {#each assetInfo.tags as tag}
        <div class="rounded bg-athens px-2 py-1">{tag.name}</div>
      {/each}
    </section>
  {/if}
{/snippet}
