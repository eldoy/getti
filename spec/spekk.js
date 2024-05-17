var download = require('../index')({ quiet: true })

module.exports = async function () {
  async function before() {}

  async function after() {}

  var $ = {
    download,
    params: {},
    app: {
      config: {
        env: {}
      }
    }
  }

  return { $, before, after }
}
