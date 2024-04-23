<script lang="ts">
  import { CustomFlowNodeTypeId } from '../nodes'
  import { AssetSelectorFlowNode } from '../nodes/AssetSelector'
  import { SelectColumnAlertFlowNode } from '../nodes/Interaction/SelectColumnAlertFlowNode'
  import { SelectColumnFlowNode } from '../nodes/Interaction/SelectColumnFlowNode'

  let { dragCtx }: { dragCtx: { dragged: { x: number; y: number } } } = $props()

  function dragstartHandler(e: DragEvent, schema: any) {
    e.dataTransfer!.setData('application/my-app', schema)
    e.dataTransfer!.effectAllowed = 'move'

    // const { left, top } = (e.currentTarget as HTMLElement).getBoundingClientRect()
    // dragCtx.dragged.x = e.clientX - left
    // dragCtx.dragged.y = e.clientX - top
  }

  const wrap = (schema) => (e) => dragstartHandler(e, CustomFlowNodeTypeId.get(schema))
</script>

<aside class="flex min-w-[300px] flex-col divide-y border-l">
  <section>
    <h2>Widgets</h2>

    <div class="flex flex-col gap-2">
      <!-- <span draggable="true" ondragstart={dragstartHandler}> Query widget </span> -->

      <span draggable="true" ondragstart={wrap(AssetSelectorFlowNode)}> Asset selector </span>
    </div>
  </section>
  <!-- 
  <section>
    <h2>Parameters</h2>

    <div class="flex flex-col gap-2">
      <span draggable="true" ondragstart={dragstartHandler}> Global parameter </span>
    </div>
  </section>
 -->

  <section>
    <h2>Interactions</h2>

    <div class="flex flex-col gap-2">
      <span draggable="true" ondragstart={wrap(SelectColumnFlowNode)}> Select column </span>

      <span draggable="true" ondragstart={wrap(SelectColumnAlertFlowNode)}>
        Column data to alert
      </span>
    </div>
  </section>

  <!--
  <section>
    <h2>Add-ons</h2>

    <div class="flex flex-col gap-2">
      <span draggable="true" ondragstart={wrap('')}> Create alert </span>
    </div>
  </section>
  -->
</aside>

<style>
  h2 {
    @apply mb-2 text-xl;
  }

  section {
    @apply px-4 py-2 pb-4;
  }

  span {
    @apply cursor-pointer rounded border bg-white px-2 py-4 text-center;
  }
</style>
