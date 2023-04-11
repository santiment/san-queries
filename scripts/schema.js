require('@babel/register')({
  presets: ['@babel/preset-env'],
  only: [/node_modules\/san-webkit/],
})

process.env.SERVER_FETCH = require('node-fetch')
globalThis.fetch = require('node-fetch')

const fs = require('fs')
const path = require('path')
const { query } = require('san-webkit/lib/api')
const { mkdir } = require('san-webkit/scripts/utils')

process.env.GQL_SERVER_URL = 'https://api.santiment.net/graphql'
process.browser = false

const ROOT = path.resolve(__dirname, '..')
const SCHEMA_DIR = path.resolve(ROOT, 'public', 'schema')

const COLUMNS = 'table-columns'
const TABLES = 'tables'
const FUNCTIONS = 'functions'

function fetchSchema() {
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
  return query(`{ data: getClickhouseDatabaseMetadata { ${field} { ${data} } } }`).then(
    ({ data }) => data[field],
  )
}
function saveSchema(filename, data) {
  mkdir(SCHEMA_DIR)
  fs.writeFileSync(path.resolve(SCHEMA_DIR, filename) + '.json', JSON.stringify(data))

  return data
}

exports.module = { fetchSchema }
