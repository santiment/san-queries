import { mutate } from 'webkit/api'
import { serializeParameters } from './utilts'

export function mutateCreateSqlQuery(variables: {
  name: string
  description?: string

  sql: string
  parameters: App.Parameter[]

  isPublic?: boolean
  settings?: App.ApiQuery['settings']
}) {
  return mutate<SAN.API.Query<'createSqlQuery', App.ApiQuery>>(
    `mutation createSqlQuery($name: String!, $description: String, $isPublic:Boolean, $settings: json, $sql: String, $parameters: json) {
    createSqlQuery(name:$name, description:$description, isPublic:$isPublic, sqlQueryText:$sql, sqlQueryParameters:$parameters, settings:$settings) {
      id
      name
      description
      isPublic
      #createdAt # Cannot return null for non-nullable field
      settings
      sqlQueryParameters
      sqlQueryText
    }
  }`,
    {
      variables: {
        ...variables,
        settings: JSON.stringify(variables.settings || {}),
        parameters: serializeParameters(variables.parameters),
      },
    },
  ).then(({ createSqlQuery }) => createSqlQuery)
}

declare global {
  namespace App {
    type ApiQuery = {
      id: number
      name: string
      description: string
      isPublic: boolean
      createdAt: string

      sqlQueryParameters: Record<string, number | string>
      sqlQueryText: string

      dashboardQueryMappingId: string

      settings: {
        columns?: Record<
          string,
          | undefined
          | Partial<{
              title: string
              formatter: number
            }>
        >
      }
    }
  }
}
