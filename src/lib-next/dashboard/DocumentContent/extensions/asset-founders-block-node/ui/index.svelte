<script lang="ts">
  import type { TDataWidgetProps } from '../../schema/data-widget'

  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import type { ASSET_FOUNDERS_BLOCK_NODE } from '../schema'
  import Note from '../../utils/Note.svelte'
  import { useDataWidgetParameterOverrides } from '$lib-next/dashboard/ctx/data-widgets.svelte'

  import { useObserveFnCall } from 'san-webkit-next/utils'
  import { switchMap, tap } from 'rxjs'
  import { queryAssetFounders } from './api'
  import { useUiCtx } from 'san-webkit-next/ctx/ui'
  import { applyStyles } from 'san-webkit-next/ui/utils'
  import { useAssetsCtx } from 'san-webkit-next/ctx/assets'

  import Picture from 'san-webkit-next/ui/app/Picture'
  import Svg from 'san-webkit-next/ui/core/Svg'

  import ragData from '../rag.json'

  let { data }: TDataWidgetProps<typeof ASSET_FOUNDERS_BLOCK_NODE> = $props()

  const { widget } = data
  const { id, settings } = widget

  const { ui } = useUiCtx()
  const { getAssetBySlug } = useAssetsCtx()
  const { parameterOverrides } = useDataWidgetParameterOverrides(id, widget.data.inputs)
  const { dashboard } = useDashboardCtx.get()

  const asset = $derived(getAssetBySlug(parameterOverrides.$.slug || 'bitcoin'))
  let assetFounders = $state.raw<any>([])

  $inspect(assetFounders)

  const loadAssetFounders = useObserveFnCall<{ slug: string }>(() =>
    switchMap((variables) =>
      queryAssetFounders()(variables).pipe(
        tap((data) => {
          const asset = getAssetBySlug(variables.slug)

          assetFounders = asset ? data.filter((item) => item.project.name === asset.name).map(({ name }) => ({ name, role: getRole(ragData, asset.slug, name) })) : []
        }),
      ),
    ),
  )

  $effect(() => {
    if (asset) loadAssetFounders(asset)
  })

  const getRole = (data: unknown, slug: string, name: string): string | null => {
    return (data as Record<string, { name: string; confidence: number; role: string }[]>)[slug]?.find(person => person.name === name)?.role || null
  }
</script>

{#if dashboard.isEditable}
  <div class="flex-1 gap-3 rounded border border-dashed border-blue p-3 column">
    <Note class="border-red bg-red-light-1 fill-red">
      This widget is unstable and might be removed soon
    </Note>

    {@render founders()}
  </div>
{:else}
  {@render founders()}
{/if}

{#snippet founders()}
  <section class="flex flex-wrap gap-[72px]">
    {#each assetFounders as assetFounder}
      {@render founder(assetFounder)}
    {/each}
  </section>
{/snippet}

{#snippet founder(item: { name: string, role?: string })}
  <article class="max-w-[300px] gap-3 text-fiord column">
    <header class="flex items-center gap-4">
      <Picture class="size-11 text-base">
        {(item.name || '').slice(0, 1).toUpperCase()}
      </Picture>
      <div>
        <h2 class="text-medium text-base text-black">
          {item.name}
        </h2>
        {#if item.role}
          <p>{item.role}</p>
        {/if}
      </div>
    </header>

    <div class="gap-1.5 whitespace-nowrap column">
      <p class="text-xs">Social reputation</p>

      <div class="min-w-[190px] text-xs row">
        <div class="sentiment positive"></div>
        <div class="sentiment negative"></div>
      </div>
    </div>

    <!--
    <p class="">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi eos dolores sed animi fugiat
      vel veritatis inventore similique corporis, incidunt in vitae nemo ipsam error accusantium
      dolor, pariatur perspiciatis obcaecati quasi.
    </p>

    <div class="flex items-center gap-2 fill-waterloo">
      <span class="flex size-8 center">
        <Svg id="telegram"></Svg>
      </span>

      2,5K followers on X
    </div>
    -->
  </article>
{/snippet}

<style>
  .sentiment {
    flex: 1;
  }

  .sentiment::before {
    content: '';
    display: block;
    height: 6px;
    width: 100%;
    background: var(--green);
  }

  .sentiment::after {
    content: '55% Positive';
    color: var(--green);
  }

  .sentiment.negative {
    text-align: right;
  }

  .sentiment.negative::before {
    background: var(--red);
  }

  .sentiment.negative::after {
    content: '45% Negative';
    color: var(--red);
  }
</style>
