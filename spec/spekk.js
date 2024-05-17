var getti = require('../index')

process.env.GETTI_OPTIONS_QUIET = 1

module.exports = async function () {
  async function before() {}

  async function after() {}

  var $ = {
    getti,
    params: {},
    app: {
      config: {
        env: {}
      }
    }
  }

  return { $, before, after }
}
