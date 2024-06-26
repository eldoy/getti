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
  var r = await $.getti(url)
  t.deepEqual(r, sample)
})

it('sample.json string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.getti(url, cb)
  t.deepStrictEqual(r, sample.map(cb))
})

// sample.json - object inputn
it('sample.json object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.getti({ url })
  t.deepEqual(r, sample)
})

it('sample.json object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJson
  var r = await $.getti({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.json.gz - string input
it('sample.json.gz string, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.getti(url)
  t.deepEqual(r, sample)
})

it('sample.json.gz string + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.getti(url, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample.json.gz - object input
it('sample.json.gz object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.getti({ url })
  t.deepEqual(r, sample)
})

it('sample.json.gz object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleJsonGz
  var r = await $.getti({ url }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample - string input
it('sample string, throws error', async ({ t, $ }) => {
  var url = endpoints.sample
  await t.rejects(
    async () => await $.getti(url),
    new TypeError('Undefined file type')
  )
})

it('sample string + cb, throws error', async ({ t, $ }) => {
  var url = endpoints.sample
  await t.rejects(
    async () => await $.getti(url, cb),
    new TypeError('Undefined file type')
  )
})

// sample - object input
it('sample object, returns sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.getti({ url, type: 'json' })
  t.deepEqual(r, sample)
})

it('sample object + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sample
  var r = await $.getti({ url, type: 'json' }, cb)
  t.deepEqual(r, sample.map(cb))
})

// sample-gz - string input
it('sample-gz string, throws error', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  await t.rejects(
    async () => await $.getti(url),
    new TypeError('Undefined file type')
  )
})

it('sample-gz string + cb, throws error', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  await t.rejects(
    async () => await $.getti(url, cb),
    new TypeError('Undefined file type')
  )
})

// sample-gz - object input
it('sample-gz object + type, returns sample', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  var r = await $.getti({ url, type: 'json.gz' })
  t.deepEqual(r, sample)
})

it('sample-gz object + type + cb, returns mapped sample', async ({ t, $ }) => {
  var url = endpoints.sampleGz
  var r = await $.getti({ url, type: 'json.gz' }, cb)
  t.deepEqual(r, sample.map(cb))
})
