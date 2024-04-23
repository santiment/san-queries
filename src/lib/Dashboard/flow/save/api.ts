import { QUERY_FRAGMENT } from '$lib/QueryEditor/api'
import { Fetcher } from '$lib/api'

export const DASHBOARD_FRAGMENT = `
  id
  name
  description
  isPublic
  settings
  parameters
  textWidgets { id body }
  queries {${QUERY_FRAGMENT}}
  commentsCount
  votedAt
  votes { userVotes:currentUserVotes  totalVotes }
  user {id username avatarUrl}
`

export const mutateCreateDashboard = Fetcher(
  ({
    name,
    description,
    settings,
  }: {
    name: string
    description?: string
    settings?: App.Dashboard.ApiSettings
  }) => ({
    schema: `mutation ($name: String!, $description: String, $settings: json) {
    data:createDashboard(name:$name, description:$description, settings: $settings) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    variables: { name, description, settings: settings ? JSON.stringify(settings) : undefined },
  }),
  (gql: { data: App.ApiDashboard }) => gql.data,
)

export const mutateUpdateDashboard = Fetcher(
  ({
    id,
    name,
    description,
    isPublic,
    settings,
  }: { id: number } & Partial<{
    name: string
    description: string
    isPublic: boolean
    settings: App.Dashboard.ApiSettings
  }>) => ({
    schema: `mutation ($id: Int!, $name: String, $description: String, $isPublic: Boolean, $settings: json) {
    data:updateDashboard(id:$id, name:$name, description:$description, isPublic:$isPublic, settings: $settings) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    variables: {
      id,
      name,
      description,
      isPublic,
      settings: settings ? JSON.stringify(settings) : undefined,
    },
  }),
  (gql: { data: App.ApiDashboard }) => gql.data,
)
