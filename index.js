var os = require('os')
var dugg = require('dugg')()
var { run, print } = require('extras')
var jsonstrom = require('jsonstrom')
var csvstrom = require('csvstrom')
var { URL } = require('url')
var getType = require('./lib/getType')

var log = {
  info: function (message) {
    return message ? console.info(message) : console.info()
  },
  time: function (message) {
    return console.time(message)
  },
  timeEnd: function (message) {
    return console.timeEnd(message)
  }
}

function quiet() {
  log.info = function () {}
  log.time = function () {}
  log.timeEnd = function () {}
  print = function () {}
  dugg.download = async function (url, path, opts) {
    return require('dugg')().download(url, path, { ...opts, quiet: true })
  }
  run = function (cmd, opts) {
    return require('extras').run(cmd, { ...opts, quiet: true })
  }
}

module.exports = async function download(options, callback) {
  // process input
  if (typeof options != 'object') {
    options = { url: options }
  }

  var url = new URL(options.url)
  var type = options.type || getType(url)

  if (!type) throw new TypeError('Undefined file type')

  if (!['undefined', 'function'].includes(typeof callback)) {
    throw new TypeError('Callback must be a function')
  }

  options.quiet && quiet()

  // download file
  var date = Date.now()
  var path = `${os.tmpdir()}/${date}.${type}`

  log.info(`Downloading file to: ${path}`)

  var res = await dugg.download(url.href, path, { quiet: options.quiet })

  if (res.downloaded != res.total) {
    run(`rm ${path}`)
    throw new Error(`Abort: Downloaded ${res.downloaded} of ${res.total}.`)
  }

  var filename = path

  // decompress file
  if (type.endsWith('.gz')) {
    try {
      log.info('Decompressing data...')
      run(`gzip -d ${path}`)
      filename = path.slice(0, -3)
    } catch (err) {
      run(`rm ${path}`)
      throw err
    }
  }

  // convert file to JSON
  if (type.includes('csv')) {
    log.info(`Converting CSV to JSON...`)
    log.time('CSV convert:')
    var { count } = await csvstrom(filename)
    log.timeEnd('CSV convert:')
    log.info(`Converted ${count} rows of CSV to JSON`)
    run(`rm ${filename}`)
    filename = filename.replace(/\.csv$/, '.json')
  }

  // process JSON file
  log.info('Processing data...')
  log.time('Processed data')

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
  } finally {
    run(`rm ${filename}`)
  }

  log.info()
  log.timeEnd('Processed data')
  log.info(`${count}/${stream.count} entries loaded.`)

  if (data.length) return data
}
