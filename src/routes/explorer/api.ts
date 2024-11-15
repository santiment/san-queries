import { Fetcher } from '$lib/api'

const DATA = `id name description
  user { id username avatarUrl }
  votes { totalVotes }
`

type Entity<T> = {
  type: T
  id: string
  name: string
  description?: string
  user: App.Author
  votes: { totalVotes: number }
  commentsCount?: number
}

export const queryGetMostRecent = Fetcher(
  (
    variables: Partial<{
      pageSize: number
      currentUserDataOnly: boolean
      types: ('DASHBOARD' | 'QUERY')[]
    }> = {
      types: ['DASHBOARD', 'QUERY'],
    },
  ) => ({
    schema: `
    query($types:[EntityType], $currentUserDataOnly:Boolean, $pageSize:Int = 100) {
  getMostRecent(types:$types, pageSize:$pageSize, page:1, minDescriptionLength:0, currentUserDataOnly:$currentUserDataOnly) {
    items:data {
      query {
        ${DATA}
      }
      dashboard {
        ${DATA}
        commentsCount
      }
    }
  }
}`,
    variables,
  }),
  (data: {
    getMostRecent: {
      items: Partial<{
        query: Entity<'query'>
        dashboard: Entity<'dashboard'>
      }>[]
    }
  }) => {
    const { items } = data.getMostRecent
    return {
      items: items.map((item) => {
        const [type, entity] = Object.entries(item).find(([_key, value]) => !!value) ?? []

        if (!entity) return null

        entity.type = type as any

        return entity
      }),
    }
  },
)

export type TData = API.ExtractData<typeof queryGetMostRecent>
export type TEntities = TData['items']
export type TEntity = NonNullable<TEntities[number]>
export type TEntityMap = {
  [K in TEntity['type']]: Entity<K>
}
