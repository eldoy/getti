var os = require('os')
var dugg = require('dugg')()
var { run, print } = require('extras')
var jsonstrom = require('jsonstrom')
var csvstrom = require('csvstrom')
var { URL } = require('url')
var getType = require('./lib/getType')

function quiet() {
  console.info = () => {}
  console.time = () => {}
  console.timeEnd = () => {}
  print = () => {}
  dugg.download = async function (url, path, opts) {
    return require('dugg')().download(url, path, { ...opts, quiet: true })
  }
}

async function download(options, callback) {
  if (typeof options != 'object') {
    options = { url: options }
  }

  options.quiet && quiet()

  var url = new URL(options.url)
  var type = options.type || getType(url)

  if (!type) throw new TypeError('Undefined file type')

  if (!['undefined', 'function'].includes(typeof callback)) {
    throw new TypeError('Callback must be a function')
  }

  var date = Date.now()
  var path = `${os.tmpdir()}/${date}.${type}`
  console.info(`Downloading file to: ${path}`)

  var res = await dugg.download(url.href, path, { quiet: options.quiet })

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

module.exports = function (config) {
  config && !!config.quiet && quiet()
  return download
}
