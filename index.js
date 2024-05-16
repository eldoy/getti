var os = require('os')
var dugg = require('dugg')()
var { run } = require('extras')
var jsonstrom = require('jsonstrom')
var csvstrom = require('csvstrom')
var { URL } = require('url')

function print(str) {
  if (typeof str == 'object') {
    str = JSON.stringify(str)
  }
  if (process.env.NODE_ENV == 'production') {
    console.info(`${str}`)
  } else {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(`${str}`)
  }
}

function mapType(str) {
  if (str.includes('json')) return 'json'
  if (str.includes('csv')) return 'csv'
}

function getParams(url, type) {
  if (type) return { url: url.href, type }

  var types = url.pathname.split('.')

  if (types.length == 2) {
    types = [types.at(-1)]
  } else if (types.length > 2) {
    types = [mapType(types.at(-2)), types.at(-1)]
  }

  if (types.length == 1 && types.includes('gz')) {
    types = ['', 'gz']
  }

  return { url: url.href, type: types.join('.') || 'json' }
}

function parseInput(input) {
  var url
  if (typeof input == 'string') {
    url = new URL(input)
  } else if (typeof input == 'object') {
    url = new URL(input.url)
  }
  return getParams(url, input.type)
}

module.exports = async function (input, callback) {
  if (!input || !['string', 'object'].includes(typeof input)) {
    throw new TypeError('Invalid URL')
  }

  if (typeof callback != 'undefined' && typeof callback != 'function') {
    throw new TypeError('Invalid parameter: callback must be a function')
  }

  var { url, type } = parseInput(input)

  if (!url) {
    throw new TypeError('Invalid URL')
  }

  var date = Date.now()
  var path = `${os.tmpdir()}/${date}.${type}`
  console.info(`Downloading file to: ${path}`)

  var res = await dugg.download(url, path)

  if (res.downloaded != res.total) {
    run(`rm ${path}`)
    throw new Error(`Abort: Downloaded ${res.downloaded} of ${res.total}.`)
  }

  var filename = path

  if (type.endsWith('.gz')) {
    try {
      console.info('Decompressing data...')
      run(`gzip -d ${path}`)
      filename = path.slice(0, -3)
    } catch (err) {
      run(`rm ${path}`)
      throw err
    }
  }

  if (type.includes('csv')) {
    console.info(`Converting CSV to JSON...`)
    console.time('CSV convert:')
    var { count } = await csvstrom(filename)
    console.timeEnd('CSV convert:')
    console.info(`Converted ${count} rows of CSV to JSON`)
    run(`rm ${filename}`)
    filename = filename.replace(/\.csv$/, '.json')
  }

  console.info('Processing data...')
  console.time('Processed data')

  var data = []
  var count = 0

  try {
    var stream = await jsonstrom(filename, async function ({ value }) {
      var result = callback ? callback(value) : value
      if (typeof result != 'undefined') data.push(result)
      if (count % 10000 == 0) {
        print(count)
      }
      count++
    })
  } catch (err) {
    run(`rm ${filename}`)
    throw err
  }

  console.info()
  console.timeEnd('Processed data')
  console.info(`${count}/${stream.count} entries loaded.`)

  run(`rm ${filename}`)

  if (data.length) return data
}
