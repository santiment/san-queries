import DataTab from './Data/index.svelte'
import WorkTab from './Work/index.svelte'
import UseCasesTab from './UserCases/index.svelte'

export const TABS = [
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
