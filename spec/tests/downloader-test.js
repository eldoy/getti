it('empty params, throws error', async ({ t, $ }) => {
  await t.rejects(async () => await $.load(), new TypeError('Invalid URL'))
})

it('number, throws error', async ({ t, $ }) => {
  var input = 1
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('boolean, throws error', async ({ t, $ }) => {
  var input = true
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('date, throws error', async ({ t, $ }) => {
  var input = new Date()
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('empty string, throws error', async ({ t, $ }) => {
  var input = ''
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('invalid URL string, throws error', async ({ t, $ }) => {
  var input = 'abc'
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('empty object, throws error', async ({ t, $ }) => {
  var input = {}
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('empty string url object, throws error', async ({ t, $ }) => {
  var input = { url: '' }
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('invalid string url object, throws error', async ({ t, $ }) => {
  var input = { url: 'abc' }
  await t.rejects(async () => await $.load(input), new TypeError('Invalid URL'))
})

it('string url, returns results', async ({ t, $ }) => {
  var input = 'https://7ino.s3.amazonaws.com/json-sample-sdjfru.json'
  var r = await $.load(input)
  t.ok(r.length == 2)
})

it('string url + output=false, does not return results', async ({ t, $ }) => {
  var input = 'https://7ino.s3.amazonaws.com/json-sample-sdjfru.json'
  var r = await $.load(input, { output: false })
  t.ok(!r)
})
