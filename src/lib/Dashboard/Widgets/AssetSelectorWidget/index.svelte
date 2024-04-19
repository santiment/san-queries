<script lang="ts">
  import Svg from '$lib/ui/Svg.svelte'
  import { showSelectAssetDialog$ } from './Dialog.svelte'
  import { useDataFlowCtx } from '$lib/DataFlow/ctx'
  import Button from '$lib/ui/Button.svelte'
  import { useDashboardWidgetsCtx } from '$lib/Dashboard/ctx/widgets'
  import { useDashboardLayoutCtx } from '$lib/Dashboard/ctx/layout'
  import { useObserve } from 'svelte-runes'
  import { queryProjectBySlug } from './api'
  import { tap } from 'rxjs'

  let { widget, readonly = true } = $props()

  const { removeWidget } = useDashboardWidgetsCtx()
  const { removeItem } = useDashboardLayoutCtx()
  const showSelectAssetDialog = showSelectAssetDialog$()
  const { FlowNodeByWidgetId, removeFlowNode } = useDataFlowCtx()

  let flowNode = $derived(FlowNodeByWidgetId.get(widget.id))
  let project = $state.frozen(widget.data || {})

  useObserve(() =>
    queryProjectBySlug()(project.slug).pipe(tap((data) => flowNode?._state.next(data))),
  )

  function onAssetSelect(asset) {
    flowNode?._state.next(asset)
  }

  function onAssetClick() {
    showSelectAssetDialog({
      onAssetSelect,
    })
  }

  function onWidgetRemoveClick() {
    // removeFlowNode(flowNode)
  }

  $effect(() => {
    const subscriber = flowNode?.state$.subscribe((value) => {
      project = value
    })

    return () => subscriber?.unsubscribe()
  })
</script>

<div class="flex items-center">
  {#if project}
    <button
      class="group flex w-full items-center gap-2 rounded border bg-white px-3 py-2"
      onclick={onAssetClick}
    >
      <img
        class=" size-5 rounded-full"
        src={project.logoUrl ||
          `https://production-sanbase-images.s3.amazonaws.com/uploads/logo64_${project.slug}.png`}
        alt="Project"
        loading="lazy"
      />

      {project.name || project.slug}

      {#if project.ticker}
        ({project.ticker})
      {/if}

      <Svg id="arrow-down" w="12" class="ml-auto group-hover:fill-green"></Svg>
    </button>
  {/if}

  {#if !readonly}
    <!-- <Button icon="close" iconSize="12" onclick={onWidgetRemoveClick}></Button> -->
  {/if}
</div>
