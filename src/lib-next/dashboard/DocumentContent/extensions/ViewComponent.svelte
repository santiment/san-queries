<script lang="ts">
  import type { ViewProps } from 'tiptap-svelte-adapter'
  import type { TDataWidgetProps } from './schema/data-widget'
  import type { TParameterWidgetProps } from './schema/parameter-widget'
  import { onMount } from 'svelte'
  import { BROWSER } from 'esm-env'
  import { triggerEmptyUpdate, useDeepChangeEffect } from './utils'

  type TProps = {
    nodeConfig: any
    view: ViewProps['view']
    data: Partial<TDataWidgetProps['data']> | Partial<TParameterWidgetProps['data']>
  }

  let { nodeConfig, view, data }: TProps = $props()

  if (BROWSER && data.id && view.$.editor.isEditable) {
    Object.assign(view.$.node.attrs, { 'data-id': data.id })

    if (data.widget?.settings) {
      const { settings } = data.widget
      useDeepChangeEffect(settings, () => triggerEmptyUpdate(view))
    }
  }

  onMount(() => {
    const { widget } = data
    if (!widget) return
    if (view.$.editor.isEditable === false) return

    widget.__isDestroyed.$ = false

    return () => {
      widget.__isDestroyed.$ = true
    }
  })
</script>

{#if data.id && data.widget}
  <nodeConfig.Component {view} data={data as any}></nodeConfig.Component>
{/if}
