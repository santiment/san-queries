<script lang="ts" context="module">
  import { CMD } from 'san-webkit/lib/utils/os'
  import { GlobalShortcut$ } from 'san-webkit/lib/utils/events'

  export const TABS = [
    { title: 'Editor', ariaLabel: `${CMD} + 1` },
    { title: 'Visualisation', ariaLabel: `${CMD} + 2` },
    { title: 'Errors', ariaLabel: `${CMD} + 3` },
  ] as const

  export type TabType = (typeof TABS)[number]
</script>

<script lang="ts">
  import { cn } from '$lib/ui/utils'
  import { useStore } from 'svelte-runes'

  let { tab = TABS[0], onTabSelect }: { tab: TabType; onTabSelect: (tab: TabType) => void } =
    $props()

  const useShortcut = (keys: string, clb: () => void) => useStore(GlobalShortcut$(keys, clb, false))

  useShortcut('CMD+1', () => {
    onTabSelect(TABS[0])
  })
  useShortcut('CMD+2', () => {
    onTabSelect(TABS[1])
  })
  useShortcut('CMD+3', () => {
    onTabSelect(TABS[2])
  })
</script>

<tabs class="ml-8 mt-4 flex gap-4">
  {#each TABS as item (item.title)}
    <button
      class={cn(
        'expl-tooltip border-b border-transparent pb-1.5',
        tab === item && 'border-green text-green',
      )}
      aria-label={item.ariaLabel}
      onclick={() => onTabSelect(item)}
    >
      {item.title}
    </button>
  {/each}
</tabs>
