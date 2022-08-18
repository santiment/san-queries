const svelte = require('svelte/compiler')
const cssModules = require('svelte-preprocess-cssmodules')
const fs = require('fs')
const path = require('path')
const { forFile, mkdir } = require('san-webkit/scripts/utils')
const { Preprocess, RoutesPreprocess } = require('san-webkit/scripts/svelte')
const { SRC, LIB } = require('./utils')

const preprocess = Preprocess({
  typescript: { tsconfigDirectory: path.resolve(__dirname, '../') },
})

const routesPreprocess = RoutesPreprocess(LIB)

async function processSvelte() {
  forFile(['src/**/*.svelte'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    const { code } = await svelte.preprocess(
      file.toString(),
      [routesPreprocess, cssModules(), preprocess],
      { filename: absolutePath },
    )

    const libFilePath = path.resolve(LIB, entry.slice('src/'.length))
    const libDirPath = path.dirname(libFilePath)
    mkdir(libDirPath)

    fs.writeFileSync(libFilePath, code)
  })

  forFile(['src/**/*.svg', 'src/**/*.png'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)
    const libFilePath = path.resolve(LIB, entry.slice('src/'.length))
    fs.writeFileSync(libFilePath, file)
  })
}

function main() {
  processSvelte()

  forFile(['lib/**/*.js.map'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const relativeSrc = path.relative(path.dirname(entry), SRC)

    const file = fs.readFileSync(absolutePath)

    fs.writeFileSync(
      absolutePath,
      file.toString().replace(`"sourceRoot":"../src/"`, `"sourceRoot":"${relativeSrc}/"`),
    )
  })
}
main()

module.exports = {
  processSvelte,
}
