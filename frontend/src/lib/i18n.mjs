import { watch, readFileSync, writeFileSync, readdirSync } from 'fs'
import { load } from 'js-yaml'
import { resolve, join, extname } from 'path'

const TRANSLATION_PATH = resolve('src/locales')
const CONSTANT_PATH = resolve('src/constants')
const files = readdirSync(TRANSLATION_PATH)
const translationConstantFile = join(CONSTANT_PATH, 'translation.ts')
const DEFAULT_LANGUAGE = 'en'

const kv = (obj, r = '') =>
  Object.entries(obj)
    .map(([k, v]) =>
      v instanceof Object
        ? { [k]: kv(v, [r, k].join('.')) }
        : { [k.split('_').at(0)]: [r, k].join('.').slice(1).split('_').at(0) },
    )
    .reduce((acc, val) => ({ ...acc, ...val }), {})

function build(filename) {
  try {
    const fullpath = join(TRANSLATION_PATH, filename)
    if (extname(fullpath) !== '.yaml') return // Ignore files that are not .yaml

    const yaml = readFileSync(fullpath, 'utf8')
    const doc = load(yaml)
    if (doc) {
      const json = JSON.stringify(doc)
      console.log(json)
      writeFileSync(fullpath.replace('.yaml', '.json'), json, 'utf8')
      const translation =
        JSON.stringify(kv(doc), undefined, 2)
          .replace(/"(\S+)"/g, "'$1'")
          .replace(/'(\S+)':/g, '$1:')
          .replace(/}\n/g, '},\n')
          .replace(/'\n/g, "',\n") + '\n'
      filename.includes(DEFAULT_LANGUAGE) &&
        writeFileSync(translationConstantFile, `export const Translation = ${translation}`, 'utf8')
    }
  } catch (err) {
    console.error(err)
  }
}

files.filter((file) => extname(file) === '.yaml').forEach(build) // Process only .yaml files
files.forEach(
  (file) =>
    (process.argv.slice(2)?.at(0) === '--watch' || process.argv.slice(2)?.at(0) === '-w') &&
    extname(file) === '.yaml' && // Watch only .yaml files
    watch(join(TRANSLATION_PATH, file), (event, filename) => {
      console.log(event, filename)
      if (event === 'change' && filename.endsWith('.yaml')) {
        build(filename)
      }
    }),
)