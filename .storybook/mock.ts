import { parse, Kind } from 'graphql'
import { rest } from 'msw'

export function ApiMock(schema: Record<string, any>) {
  return {
    handlers: [
      rest.post(process.env.GQL_SERVER_URL, (req, res, ctx) => {
        console.log({ req, res, ctx })
        const { query, variables } = req.body
        const operation = parse(query).definitions[0]

        if (operation.kind !== Kind.OPERATION_DEFINITION) {
          return req.passthrough()
        }

        let hasData = false
        const result = {}

        operation.selectionSet.selections.forEach((query) => {
          if (query.kind !== Kind.FIELD) return

          const name = query.name.value

          result[query.alias?.value || name] = schema['query ' + name]
          hasData = true
        })

        if (hasData) return res(ctx.json({ data: result }))

        return req.passthrough()
      }),
    ],
  }
}
