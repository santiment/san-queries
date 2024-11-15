<script module lang="ts">
  import Component from './LinkParameterDialog.svelte'

  export const showLinkParameterDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import type { TDashboardParameterWidget } from '../../ctx/parameter-widgets.svelte'
  import type { TDataWidgetKey, TDataWidgetLocalParameterKey } from '../../types'

  import { SvelteMap } from 'svelte/reactivity'
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'
  import Button from 'san-webkit-next/ui/core/Button'
  import Checkbox from 'san-webkit-next/ui/core/Checkbox'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { useDashboardDataWidgets } from '../../ctx/data-widgets.svelte'
  import type { Snippet } from 'svelte'

  type TProps = TDialogProps & {
    globalParameter: TDashboardParameterWidget<any>
    children?: Snippet
  }
  let { Controller, globalParameter, children }: TProps = $props()

  const { dataWidgets } = useDashboardDataWidgets.get()

  const dataWidgetsWithInputs = $derived(dataWidgets.$.filter((item) => !!item.data?.inputs))

  const firstOutput = Object.keys(globalParameter.overrides.$)[0]
  const firstOutputOverrides = new SvelteMap(globalParameter.overrides.$[firstOutput])

  function onOverrideToggle(widgetId: TDataWidgetKey, inputKey: string) {
    const override = firstOutputOverrides.get(widgetId)

    if (override === inputKey) firstOutputOverrides.delete(widgetId)
    else firstOutputOverrides.set(widgetId, inputKey as TDataWidgetLocalParameterKey)
  }

  function onApproveClick() {
    globalParameter.overrides.$[firstOutput] = new Map(firstOutputOverrides)
    globalParameter.overrides.$ = Object.assign({}, globalParameter.overrides.$)

    Controller.close()
  }
</script>

<Dialog class="w-[480px] column">
  {@render children?.()}

  <div class="overflow-auto p-4 py-3">
    {#if dataWidgetsWithInputs.length}
      <section class="flex flex-col gap-4">
        <h3 class="text-base font-medium">
          Link local parameters from queries added to this dashboard
        </h3>

        {#each dataWidgetsWithInputs as widget}
          {@const inputs = Object.keys(widget.data.inputs)}
          {#if inputs.length}
            {@const override = firstOutputOverrides.get(widget.id)}
            <article class="flex flex-col gap-2">
              <h4 class="flex items-center gap-2 fill-waterloo text-xs text-waterloo">
                <Svg id="query" w="12" />

                {widget.data.name}
              </h4>

              <div class="flex flex-wrap gap-6 gap-y-2">
                {#each Object.keys(widget.data.inputs) as inputKey, i}
                  {@const isActive = override === inputKey}
                  <Button as="label" class="flex items-center gap-2">
                    <Checkbox
                      {isActive}
                      onCheckedChange={() => onOverrideToggle(widget.id, inputKey)}
                    ></Checkbox>

                    {inputKey}
                  </Button>
                {/each}
              </div>
            </article>
          {/if}
        {/each}
      </section>
    {:else}
      No queries with parameters found
    {/if}
  </div>

  <section class="mt-4 gap-4 p-4 row">
    <Button variant="fill" onclick={onApproveClick}>Save</Button>

    <Button variant="border" onclick={() => Controller.close()}>Cancel</Button>
  </section>
</Dialog>
