const path = require('path')
const { copyWebkitAssets } = require('san-webkit/scripts/assets')

copyWebkitAssets(path.resolve('public/webkit'))
