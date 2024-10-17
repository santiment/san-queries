<script lang="ts">
  import { debounceTime, map, pipe, tap } from 'rxjs'
  import Svg from '$lib/ui/Svg.svelte'
  import { cn } from '$lib/ui/utils'
  import Input from '$lib/ui/Input.svelte'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import DataTab from './DataTab/index.svelte'
  import WorkTab from './WorkTab/index.svelte'
  import UseCasesTab from './UseCasesTab/index.svelte'
  import MyCredits from './MyCredits/index.svelte'

  const TABS = [
    {
      title: 'Data',
      icon: ['queries', 16],
      Component: DataTab,
      search: { placeholder: 'Search for tables, functions' },
    },
    {
      title: 'Work',
      icon: ['folder', 16, 14],
      Component: WorkTab,
      search: { placeholder: 'Search in your files' },
    },
    {
      title: 'Use cases',
      icon: ['insight', 14, 16],
      Component: UseCasesTab,
      search: { placeholder: 'Search for a use case' },
    },
  ] as const

  let tab = $state.raw(TABS[1])

  let scrollNode = $state<HTMLElement>()

  function onTabSelect(item: any) {
    const isNewTab = tab !== item
    scrollNode?.scroll({ top: 0, behavior: isNewTab ? undefined : 'smooth' })

    if (isNewTab) tab = item
  }

  let search = $state('')
  const onInput = useObserveFnCall<{ currentTarget: HTMLInputElement }>(() =>
    pipe(
      map(({ currentTarget }) => currentTarget),
      debounceTime(250),
      tap((node) => (search = node.value.trim())),
    ),
  )
</script>

<aside class="sticky top-0 z-[1] flex max-h-dvh w-[348px] flex-col bg-athens p-6 pb-0">
  <tabs class="mb-4 flex gap-2 border-b">
    {#each TABS as item (item.title)}
      {@const {
        title,
        icon: [id, w, h],
      } = item}
      <button
        class={cn(
          'items-center gap-2 border-b border-transparent px-2 py-1.5 row',
          tab === item && 'border-green fill-green text-green',
        )}
        onclick={() => onTabSelect(item)}
      >
        <Svg {id} {w} {h} />
        {title}
      </button>
    {/each}
  </tabs>

  <Input icon="search" class="bg-transparent" placeholder={tab.search.placeholder} oninput={onInput}
  ></Input>

  <section
    bind:this={scrollNode}
    class="-mr-6 flex flex-1 flex-col overflow-auto pb-[30vh] pr-4 pt-6"
  >
    <svelte:component this={tab.Component} {search} />
  </section>

  <MyCredits></MyCredits>
</aside>
