it('empty params, throws error', async ({ t, $ }) => {
  await t.rejects(async () => await $.download(), new TypeError('Invalid URL'))
})

it('number, throws error', async ({ t, $ }) => {
  var input = 1
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('boolean, throws error', async ({ t, $ }) => {
  var input = true
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('date, throws error', async ({ t, $ }) => {
  var input = new Date()
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('empty string, throws error', async ({ t, $ }) => {
  var input = ''
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('invalid URL string, throws error', async ({ t, $ }) => {
  var input = 'abc'
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('empty object, throws error', async ({ t, $ }) => {
  var input = {}
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('empty string url object, throws error', async ({ t, $ }) => {
  var input = { url: '' }
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('invalid string url object, throws error', async ({ t, $ }) => {
  var input = { url: 'abc' }
  await t.rejects(
    async () => await $.download(input),
    new TypeError('Invalid URL')
  )
})

it('invalid callback, throws error', async ({ t, $ }) => {
  await t.rejects(
    async () => await $.download('abc', {}),
    new TypeError('Invalid parameter: callback must be a function')
  )
})

it('valid url, returns results', async ({ t, $ }) => {
  var input = 'https://7ino.s3.amazonaws.com/json-sample-sdjfru.json'
  var r = await $.download(input)
  t.ok(r.length == 2)
})

it('valid url + non returning callback, does not return', async ({ t, $ }) => {
  var input = 'https://7ino.s3.amazonaws.com/json-sample-sdjfru.json'
  var r = await $.download(input, () => {})
  t.ok(!r)
})
