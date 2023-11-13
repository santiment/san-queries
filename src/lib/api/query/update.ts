import { mutate } from 'webkit/api'
import { serializeParameters } from './utilts'

export function mutateUpdateSqlQuery(
  variables: { id: number } & {
    name: string
    description?: string

    sql: string
    parameters: App.Parameter[]

    isPublic?: boolean
    settings?: any
  },
) {
  return mutate<SAN.API.Query<'query', App.ApiQuery>>(
    `mutation updateSqlQuery($id: Int!, $name: String, $description: String, $isPublic:Boolean, $settings: json, $sql: String, $parameters: json) {
    query:updateSqlQuery(id:$id, name:$name, description:$description, isPublic:$isPublic, sqlQueryText:$sql, sqlQueryParameters:$parameters, settings:$settings) {
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
        settings: variables.settings && JSON.stringify({}),
        parameters: variables.parameters && serializeParameters(variables.parameters),
      },
    },
  ).then(({ query }) => query)
}
