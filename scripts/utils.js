const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const LIB = path.resolve(ROOT, 'lib')
const SRC = path.resolve(ROOT, 'src')

module.exports = {
  ROOT,
  SRC,
  LIB,
}
