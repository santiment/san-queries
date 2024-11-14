import type { TSerializedDashboard } from '$lib-next/dashboard/flow/save.svelte'
import type { TApiDashboard } from '$lib-next/dashboard/types'
import { QUERY_FRAGMENT } from '$lib/QueryEditor/api'
import { ApiMutation } from 'san-webkit-next/api'

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

export const mutateCreateDashboard = ApiMutation(
  ({ name, description }: { name: string; description?: string }) => ({
    schema: `mutation ($name: String!, $description: String) {
    data:createDashboard(name:$name, description:$description) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    variables: { name, description },
  }),
  (gql: { data: TApiDashboard<any> }) => gql.data,
)

export const mutateUpdateDashboard = ApiMutation(
  ({ id, name, description, isPublic, settings }: TSerializedDashboard) => ({
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
  (gql: { data: TApiDashboard<any> }) => gql.data,
)
