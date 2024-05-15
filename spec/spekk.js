var load = require('../index')

module.exports = async function () {
  async function before() {}

  async function after() {}

  var $ = {
    load,
    params: {},
    app: {
      config: {
        env: {}
      }
    }
  }

  return { $, before, after }
}
