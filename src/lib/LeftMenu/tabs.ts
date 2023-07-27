import WorkTab from './Work/index.svelte'

export const TABS = [
  {
    title: 'Data',
    icon: ['queries', 16],
    Component: WorkTab,
  },
  {
    title: 'Work',
    icon: ['folder', 16, 14],
    Component: WorkTab,
  },
  {
    title: 'Use cases',
    icon: ['insight', 14, 16],
    Component: WorkTab,
  },
] as const
