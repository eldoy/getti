it('invalid url, throws error', async ({ t, $ }) => {
  await t.rejects(
    async () => await $.download('abc'),
    new TypeError('Invalid URL')
  )
})

it('valid url + undefined type, throws error', async ({ t, $ }) => {
  await t.rejects(
    async () => await $.download('http://localhost:9090/json-sample', {}),
    new TypeError('Undefined file type')
  )
})

it('valid url + invalid callback, throws error', async ({ t, $ }) => {
  await t.rejects(
    async () => await $.download('http://localhost:9090/json-sample.json', {}),
    new TypeError('Callback must be a function')
  )
})

it('valid url, returns results', async ({ t, $ }) => {
  var r = await $.download('http://localhost:9090/json-sample.json')
  t.ok(r.length == 2)
})

it('valid url + non returning callback, does not return', async ({ t, $ }) => {
  var r = await $.download('http://localhost:9090/json-sample.json', () => {})
  t.ok(!r)
})
