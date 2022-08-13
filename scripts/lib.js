const svelte = require('svelte/compiler')
const sveltePreprocess = require('svelte-preprocess')
const cssModules = require('svelte-preprocess-cssmodules')
const fs = require('fs')
const path = require('path')
const { forFile, mkdir } = require('san-webkit/scripts/utils')
const { SRC, LIB, replaceModuleAliases } = require('./utils')

const preprocess = sveltePreprocess({
  babel: {
    assumptions: { noDocumentAll: true },
    plugins: ['@babel/plugin-proposal-optional-chaining'],
  },
})

const routesPreprocess = {
  script: ({ content, filename }) => {
    return {
      code: replaceModuleAliases(content, filename),
    }
  },
}

async function processSvelte() {
  forFile(['src/**/*.svelte'], async (entry) => {
    const absolutePath = path.resolve(entry)
    const file = fs.readFileSync(absolutePath)

    const { code } = await svelte.preprocess(
      file.toString(),
      [cssModules(), preprocess, routesPreprocess],
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
