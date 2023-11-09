import { TreeItemType, type WorkspaceTreeType } from './types'

import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

const CTX = 'Workspace$$'

function traverseTreeForItem<T>(tree: T[], id: string | number) {
  let found = null as null | T

  tree.some((i: any) => {
    if (i.id === id) {
      found = i
      return true
    }

    if (i.children) {
      return i.children.some((i: any) => {
        if (i.id === id) {
          found = i
          return true
        }
      })
    }
  })

  return found
}

export function Workspace$$() {
  const tree = {
    children: [
      {
        type: TreeItemType.FOLDER,
        name: "Let's get you started",
        children: [
          {
            type: TreeItemType.QUERY,
            name: 'Data exploration',
          },
          {
            type: TreeItemType.QUERY,
            name: 'Commands',
          },
          {
            type: TreeItemType.QUERY,
            name: 'Functions',
          },
          {
            id: 1698653190973,
            type: TreeItemType.DASHBOARD,
            name: 'Get started dashboard',
            data: `{"widgets":[{"type":"QUERY","title":"Bitcoin daily active addresses"},{"type":"QUERY","title":"Bitcoin daily active addresses"},{"type":"TEXT","value":"Some text"},{"type":"TEXT","value":""}],"layout":[[0,2,4,8],[4,2,8,8],[0,0,12,2],[0,10,12,2]],"title":"Get started dashboard","description":"Example description","id":1698653190973}`,
          },
        ],
      },
    ] as WorkspaceTreeType,
  }

  const store = writable(tree)

  const update = (value: typeof tree) => store.set(value)

  function addItem(item) {
    let found = item.id && traverseTreeForItem(tree.children, item.id)

    if (found) {
      found.name = item.title
      found.data = JSON.stringify(item)
    } else {
      item.id = item.id || Date.now()

      tree.children.unshift({
        id: item.id,
        type: TreeItemType.DASHBOARD,
        name: item.title,
        data: JSON.stringify(item),
      } as any)
      // @ts-ignore
      // window.updateDashboardEditor(item)
    }

    update(tree)
  }

  return setContext(CTX, {
    workspace$: {
      ...store,
      rerender: () => update(tree),
      addItem,
      newFolder() {
        tree.children.unshift({
          type: TreeItemType.FOLDER,
          name: 'Untitled folder',
          children: [],
        })
        update(tree)
      },
      moveItemToFolder(sourceFolder, targetFolder, item) {
        const index = sourceFolder.children.findIndex((i) => i === item)

        sourceFolder.children.splice(index, 1)
        targetFolder.children.push(item)

        update(tree)
      },

      duplicateItem(folder, item, idx: number) {
        folder.children.splice(idx + 1, 0, { ...item, name: item.name + ' copy' })
        update(tree)
      },

      deleteItem(folder, idx: number) {
        folder.children.splice(idx, 1)
        update(tree)
      },
    },
  })
}

export const getWorkspace$Ctx = () => getContext(CTX) as ReturnType<typeof Workspace$$>