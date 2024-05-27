var os = require('os')
var dugg = require('dugg')()
var { run, print } = require('extras')
var jsonstrom = require('jsonstrom')
var csvstrom = require('csvstrom')
var { URL } = require('url')
var getType = require('./lib/getType.js')

module.exports = async function getti(options, callback) {
  if (typeof options != 'object') {
    options = { url: options }
  }

  var quiet = !!(options.quiet || process.env.GETTI_OPTIONS_QUIET)

  var url = new URL(options.url)
  var type = options.type || getType(url)

  if (!type) throw TypeError('Undefined file type')

  if (callback && typeof callback != 'function') {
    throw TypeError('Callback must be a function')
  }

  // Download file
  var date = Date.now()
  var filename = `${os.tmpdir()}/${date}.${type}`

  if (!quiet) {
    console.info(`Downloading file to: ${filename}`)
  }

  var res = await dugg.download(url.href, filename, { quiet })

  if (res.downloaded != res.total) {
    run(`rm ${filename}`)
    throw Error(`Abort: Downloaded ${res.downloaded} of ${res.total}.`)
  }

  // Decompress file
  if (type.endsWith('.gz')) {
    if (!quiet) {
      console.info('Decompressing data...')
    }
    try {
      run(`gzip -d ${filename}`)
      filename = filename.slice(0, -3)
    } catch (err) {
      run(`rm ${filename}`)
      throw err
    }
  }

  // Convert file to JSON
  if (type.includes('csv')) {
    if (!quiet) {
      console.info(`Converting CSV to JSON...`)
      console.time('CSV convert:')
    }
    var { count } = await csvstrom(filename)
    if (!quiet) {
      console.timeEnd('CSV convert:')
      console.info(`Converted ${count} rows of CSV to JSON`)
    }
    run(`rm ${filename}`)
    filename = filename.replace(/\.csv$/, '.json')
  }

  if (!quiet) {
    console.info('Processing data...')
    console.time('Processed data')
  }

  // Process JSON file
  var data = []
  var count = 0
  var stream

  try {
    stream = await jsonstrom(filename, async function ({ value }) {
      var result = callback ? await callback(value) : value
      if (typeof result != 'undefined') {
        data.push(result)
      }
      if (count % 10000 == 0 && !quiet) {
        print(count)
      }
      count++
    })
  } finally {
    run(`rm ${filename}`)
  }

  if (!quiet) {
    console.info()
    console.timeEnd('Processed data')
    console.info(`${count}/${stream.count} entries loaded.`)
  }

  if (data.length) return data
}
