import { getContext, setContext } from 'svelte'

export const TreeItemType = {
  FOLDER: 'FOLDER',
  QUERY: 'QUERY',
  DASHBOARD: 'DASHBOARD',
} as const

type ItemType = (typeof TreeItemType)[keyof typeof TreeItemType]

type Node<T extends ItemType> = { type: T; name: string }

export type FolderTreeType =
  | Node<'FOLDER'> & {
      children: Array<Node<'DASHBOARD'> | Node<'QUERY'>>
      source?: any
    }

export type ItemTreeType = Node<'DASHBOARD'> | Node<'QUERY'>

export type WorkspaceTreeType = Array<FolderTreeType | ItemTreeType>

export const RERENDER_CTX = 'rerenderTree'
export const setRerenderTreeCtx = (fn: () => void) => setContext(RERENDER_CTX, { rerenderTree: fn })
export const getRerenderTreeCtx = () =>
  getContext(RERENDER_CTX) as ReturnType<typeof setRerenderTreeCtx>
