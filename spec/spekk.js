var download = require('../index')

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
