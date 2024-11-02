import { onMount } from 'svelte'
import { queryAllProjects, type TAsset } from './api'
import { Query } from 'san-webkit-next/api/executor.js'

export function useAssetFlow() {
  let assetBySlugMap = $state.raw(new Map<string, TAsset>())

  onMount(() => {
    queryAllProjects(Query)().then((assets) => {
      assetBySlugMap = new Map(assets.map((item) => [item.slug, item]))
    })
  })

  return {
    getAssetBySlug(slug: string): TAsset {
      return assetBySlugMap.get(slug) || { slug, name: '', ticker: '', rank: null }
    },
  }
}
