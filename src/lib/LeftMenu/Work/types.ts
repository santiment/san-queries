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

export type ItemTreeType = (Node<'DASHBOARD'> | Node<'QUERY'>) & {
  data?: string
}

export type WorkspaceTreeType = Array<FolderTreeType | ItemTreeType>
