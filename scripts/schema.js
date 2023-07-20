import './env.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {query} from 'san-webkit/lib/api/index.js'
import { mkdir } from 'san-webkit/scripts/utils.js'

let ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCHEMA_DIR = path.resolve(ROOT, 'public', 'schema')

const COLUMNS = 'table-columns'
const TABLES = 'tables'
const FUNCTIONS = 'functions'

export function fetchSchema() {
  console.log('fetching')
  saveSchema(COLUMNS, [])
  saveSchema(TABLES, [])
  saveSchema(FUNCTIONS, [])

  return Promise.all([
    get('functions', 'n:name').then(saveFunctions),
    get('columns', 'n:name ta:table ty:type').then(saveTableColumns),
    get('tables', 'n:name e:engine').then(saveTables),
  ]).then(([fns, columns, tables]) => {
    return {
      hasData: Boolean(fns.length && columns.length && tables.length),
      fns,
      columns,
      tables,
    }
  })
}

// ---------------------------------------------

function saveFunctions(data) {
  const result = data.map(({ n: name }) => name)
  return saveSchema(FUNCTIONS, result)
}

function saveTables(data) {
  const result = data.map(({ n: name, e: engine }) => [name, engine])
  return saveSchema(TABLES, result)
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

  return saveSchema(COLUMNS, result)
}

// ---------------------------------------------

function get(field, data) {
  return query(`{ data: getClickhouseDatabaseMetadata { ${field} { ${data} } } }`)
    .then(({ data }) => data[field])
    .catch((e) => {
      console.log('Field error: ', { field })
      console.error(e)
      return []
    })
}
function saveSchema(filename, data) {
  mkdir(SCHEMA_DIR)
  fs.writeFileSync(path.resolve(SCHEMA_DIR, filename) + '.json', JSON.stringify(data))

  return data
}

if (process.argv[2] === '--run') fetchSchema()
