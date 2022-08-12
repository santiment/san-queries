const svelte = require('svelte/compiler')
const sveltePreprocess = require('svelte-preprocess')
const cssModules = require('svelte-preprocess-cssmodules')
const fs = require('fs')
const path = require('path')
const { forFile, mkdir } = require('san-webkit/scripts/utils')
const { LIB, replaceModuleAliases } = require('./utils')

const preprocess = sveltePreprocess()

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
}
main()

module.exports = {
  processSvelte,
}
