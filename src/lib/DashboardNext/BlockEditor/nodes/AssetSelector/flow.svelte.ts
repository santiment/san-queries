import type { HTMLAttributes } from 'svelte/elements'

import { untrack } from 'svelte'
import { Map as Map$ } from 'svelte/reactivity'
import {
  useCreateGlobalParameterFlow,
  useUpdateGlobalParameterFlow,
} from '$lib/Dashboard/GlobalParameters/flow'
import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'
import { ss } from 'svelte-runes'
import { queryAllProjects } from 'san-studio/lib/api/project'
import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
import { type ViewProps } from 'tiptap-svelte-adapter'
import { showLinkParameterDialog$ } from './LinkParameterDialog.svelte'

const getRandomKey = () => 'Asset-' + Math.floor(Math.random() * 0xffffffff).toString()

export function useParameterInitFlow(attrs: HTMLAttributes<any>) {
  const { dashboardEditor } = useDashboardEditorCtx()
  const { createGlobalParameter } = useCreateGlobalParameterFlow()

  $effect(() =>
    untrack(() => {
      if (!dashboardEditor.id) return
      if (attrs['data-id']) return

      const key = getRandomKey()
      attrs['data-id'] = key

      const parameter = {
        global: true,
        type: 'Text',
        key,
        value: attrs['data-slug'] || 'bitcoin',
        overrides: new Map$<any, any>(),
      }

      console.log('Creating', parameter)
      createGlobalParameter({
        dashboard: dashboardEditor as { id: number },
        parameter,
        overrides: { added: [], deleted: [] },
        onComplete() {
          dashboardEditor.parameters.$.push(parameter)
          dashboardEditor.parameters.$ = dashboardEditor.parameters.$
        },
      })
    }),
  )
}

export type TAsset = { slug: string; name: string; ticker: string }
export function useAssetBySlug() {
  const assets = ss(new Map<string, TAsset>())

  $effect(() =>
    untrack(() => {
      queryAllProjects().then((data) => {
        assets.$ = new Map(data.map((item) => [item.slug, item]))
      })
    }),
  )

  return {
    assets,
    getAsset(slug: string): TAsset {
      return assets.$.get(slug) || { slug, name: '', ticker: '' }
    },
  }
}

export function useSelectAssetFlow(view: ViewProps['view']) {
  const showSelectAssetDialog = showSelectAssetDialog$()
  const { dashboardEditor } = useDashboardEditorCtx()
  const { updateGlobalParameter } = useUpdateGlobalParameterFlow()

  function onAssetSelectorClick(parameter?: { value: string; key: string }) {
    if (!parameter) return

    showSelectAssetDialog().then((asset) => {
      parameter.value = asset.slug

      if (dashboardEditor.readonly === false) {
        updateGlobalParameter({
          dashboard: dashboardEditor as { id: number },
          oldKey: parameter.key,
          parameter,
          overrides: { added: [], deleted: [] },
        })
      }

      view.$.updateAttributes({ 'data-slug': asset.slug })
      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }

  return { onAssetSelectorClick }
}

export function useLinkParametersFlow() {
  const showLinkParameterDialog = showLinkParameterDialog$()
  const { dashboardEditor } = useDashboardEditorCtx()

  function onLinkParameterClick(parameter?: { key: string }) {
    if (!parameter) return

    showLinkParameterDialog({ strict: true, parameter }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }

  return { onLinkParameterClick }
}
