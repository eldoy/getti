var getti = require('../index')

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
