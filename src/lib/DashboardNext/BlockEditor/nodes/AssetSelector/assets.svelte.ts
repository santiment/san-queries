import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { queryAllProjects } from 'san-studio/lib/api/project'

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
