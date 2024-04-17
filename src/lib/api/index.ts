import { BROWSER } from 'esm-env'
import { map, Observable } from 'rxjs'
import { ajax } from 'rxjs/ajax'

const ENDPOINT = (!BROWSER && process.env.NODE_GQL_SERVER_URL) || process.env.GQL_SERVER_URL

export const RxQuery = <T>(
  schema: GqlSchema,
  options?: Partial<{
    map: (data: unknown) => T
  }>,
) => {
  const { schema: query, variables } =
    typeof schema === 'object' ? schema : { schema, variables: null }

  return ajax({
    url: ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    method: 'post',
    withCredentials: true,
  }).pipe(
    map((result) => {
      const { data, error, errors } = result.response as { data: T[]; error?: any; errors?: any }

      const queryError = error || errors

      if (queryError) throw queryError

      return options?.map ? options.map(data) : data
    }),
  )
}

export const Query = <T>(
  schema: GqlSchema,
  options?: Partial<{
    map: (data: unknown) => T
    fetcher: (typeof globalThis)['fetch']
  }>,
) => {
  const fetcher = options?.fetcher ?? globalThis.fetch
  const { schema: query, variables } =
    typeof schema === 'object' ? schema : { schema, variables: null }

  let request = fetcher(ENDPOINT, {
    headers: { 'Content-Type': 'application/json', origin: 'https://app.santiment.net/' },
    body: JSON.stringify({ query, variables }),
    method: 'post',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then(({ data, error, errors }) => {
      const queryError = error || errors

      if (queryError) {
        console.log(queryError)
        return Promise.reject(queryError)
      }

      return Promise.resolve(data)
    })
    .then((data) => {
      return options?.map ? options.map(data) : data
    }) as Promise<T>

  return request
} // Promise.resolve() as Promise<T>

export const UniQuery =
  (fetcher: (typeof globalThis)['fetch']) =>
  <T>(schema: Parameters<typeof Query<T>>[0], options?: Parameters<typeof Query<T>>[1]) =>
    Query<T>(schema, { ...options, fetcher })

type QueryExecutor = typeof RxQuery | typeof Query

type GqlSchema =
  | string
  | {
      schema: string
      variables: Record<string, null | undefined | number | string | boolean | Record<string, any>>
    }

type GqlSchemaCreator = (...args: any[]) => GqlSchema

export function Fetcher<Data, SchemaCreator extends GqlSchemaCreator>(
  schemaCreator: SchemaCreator,
  mapData?: (data: any) => Data,
) {
  return <Executor extends QueryExecutor = typeof RxQuery>(
    executor: Executor = RxQuery as Executor,
  ) => {
    type Result = Executor extends (...args: any[]) => Observable<any>
      ? Observable<Data>
      : Promise<Data>

    return (...args: Parameters<SchemaCreator>) => {
      return executor<Data>(schemaCreator(...args), { map: mapData }) as Result
    }
  }
}

export type Data<T> = (...args: any[]) => (...args: any[]) => Observable<T> | Promise<T>
declare global {
  namespace API {
    export type GqlData<T> = Data<T>

    export type ExtractData<T> = T extends () => () => infer Result
      ? Result extends Promise<infer Data>
        ? Data
        : never
      : never
  }
}
