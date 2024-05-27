var getti = require('./index.js')

var endpoint = {
  url: 'https://data.brreg.no/enhetsregisteret/api/roller/totalbestand',
  type: 'json.gz'
}

async function main() {
  await getti(endpoint, async function () {})
}

main()
