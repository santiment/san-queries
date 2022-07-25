import fs from 'fs'
import path from 'path'
import { query } from 'san-webkit/lib/api'
import { mkdir } from 'san-webkit/scripts/utils'

process.env.GQL_SERVER_URL = 'https://api-stage.santiment.net/graphiql'
process.browser = false

const ROOT = path.resolve(__dirname, '..')
const SCHEMA_DIR = path.resolve(ROOT, 'public', 'schema')

const COLUMNS = 'table-columns'
const TABLES = 'tables'
const FUNCTIONS = 'functions'

saveSchema(COLUMNS, [])
saveSchema(TABLES, [])
saveSchema(FUNCTIONS, [])

get('functions', 'n:name').then(saveFunctions)
get('columns', 'n:name ta:table ty:type').then(saveTableColumns)
get('tables', 'n:name e:engine').then(saveTables)

// ---------------------------------------------

function saveFunctions(data) {
  const result = data.map(({ n: name }) => name)
  saveSchema(FUNCTIONS, result)
}

function saveTables(data) {
  const result = data.map(({ n: name, e: engine }) => [name, engine])
  saveSchema(TABLES, result)
}

function saveTableColumns(data) {
  const result = []
  let currentTable
  let row
  let columns
  data.forEach(({ n: name, ta: table, ty: type }) => {
    if (currentTable !== table) {
      currentTable = table
      columns = []
      row = [table, columns]
      result.push(row)
    }
    columns.push([name, type])
  })
  saveSchema(COLUMNS, result)
}

// ---------------------------------------------

function get(field, data) {
  return query(`{ data: getClickhouseDatabaseMetadata { ${field} { ${data} } } }`).then(
    ({ data }) => data[field],
  )
}
function saveSchema(filename, data) {
  mkdir(SCHEMA_DIR)
  fs.writeFileSync(path.resolve(SCHEMA_DIR, filename) + '.json', JSON.stringify(data))
}
