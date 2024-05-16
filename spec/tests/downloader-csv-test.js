var sample = require('../samples/csv-sample.json')

var endpoints = {
  sample: 'https://7ino.s3.amazonaws.com/csv-sample-sdkov6.',
  sampleGz: 'https://7ino.s3.amazonaws.com/csv-sample-gz-sdkov6.',
  sampleCsv: 'https://7ino.s3.amazonaws.com/csv-sample-sdkov6.csv',
  sampleCsvGz: 'https://7ino.s3.amazonaws.com/csv-sample.csv-sdkov6.gz'
}

var cb = (v) => ({ id: v.organisasjonsnummer, name: v.navn })

// sample.csv - string input
it('sample.csv string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsv
  var r = await $.download(url)
  t.deepStrictEqual(r, sample)
})

it('sample.csv string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsv
  var r = await $.download(url, cb)
  t.deepStrictEqual(r, sample.map(cb))
})

// sample.csv - object inputn
it('sample.csv object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsv
  var r = await $.download({ url })
  t.deepEqual(r, sample)
})

it('sample.csv object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsv
  var r = await $.download({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.csv.gz - string input
it('sample.csv.gz string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsvGz
  var r = await $.download(url)
  t.deepEqual(r, sample)
})

it('sample.csv.gz string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsvGz
  var r = await $.download(url, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.csv.gz - object input
it('sample.csv.gz object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsvGz
  var r = await $.download({ url })
  t.deepEqual(r, sample)
})

it('sample.csv.gz object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleCsvGz
  var r = await $.download({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample - string input
it('sample string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sample
  await t.rejects(
    async () => await $.download(url),
    new Error('Parser cannot parse input: expected a value')
  )
})

it('sample string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sample
  await t.rejects(
    async () => await $.download(url),
    new Error('Parser cannot parse input: expected a value')
  )
})

// sample - object input
it('sample object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download({ url, type: 'csv' })
  t.deepEqual(r, sample)
})

it('sample object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download({ url, type: 'csv' }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample-gz - string input
it('sample-gz string, throws error', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  await t.rejects(
    async () => await $.download(url),
    new Error('Parser cannot parse input: expected a value')
  )
})

it('sample-gz string + cb, throws error', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  await t.rejects(
    async () => await $.download(url, cb),
    new Error('Parser cannot parse input: expected a value')
  )
})

// sample-gz - object input
it('sample-gz object + type, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  var r = await $.download({ url, type: 'csv.gz' })
  t.deepEqual(r, sample)
})

it('sample-gz object + type + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  var r = await $.download({ url, type: 'csv.gz' }, cb)
  t.deepEqual(r, sample.map(cb))
})
