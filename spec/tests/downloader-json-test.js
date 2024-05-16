var sample = require('../samples/json-sample.json')

var endpoints = {
  sample: 'http://localhost:9090/json-sample',
  sampleGz: 'http://localhost:9090/json-sample-gz',
  sampleJson: 'http://localhost:9090/json-sample.json',
  sampleJsonGz: 'http://localhost:9090/json-sample.json.gz'
}

var cb = (v) => ({ id: v.organisasjonsnummer, name: v.navn })

// sample.json - string input
it('sample.json string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.download(url)
  t.deepEqual(r, sample)
})

it('sample.json string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.download(url, cb)
  t.deepStrictEqual(r, sample.map(cb))
})

// sample.json - object inputn
it('sample.json object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.download({ url })
  t.deepEqual(r, sample)
})

it('sample.json object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.download({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.json.gz - string input
it('sample.json.gz string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.download(url)
  t.deepEqual(r, sample)
})

it('sample.json.gz string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.download(url, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.json.gz - object input
it('sample.json.gz object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.download({ url })
  t.deepEqual(r, sample)
})

it('sample.json.gz object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.download({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample - string input
it('sample string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download(url)
  t.deepEqual(r, sample)
})

it('sample string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download(url, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample - object input
it('sample object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download({ url })
  t.deepEqual(r, sample)
})

it('sample object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.download({ url }, cb)
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
  var r = await $.download({ url, type: 'json.gz' })
  t.deepEqual(r, sample)
})

it('sample-gz object + type + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  var r = await $.download({ url, type: 'json.gz' }, cb)
  t.deepEqual(r, sample.map(cb))
})
