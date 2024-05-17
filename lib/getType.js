module.exports = function (url) {
  var types = url.pathname.split('.')
  if (types.length == 1) {
    types = []
  } else if (types.length == 2) {
    types = [types.at(-1)]
  } else if (types.length > 2) {
    types = [types.at(-2), types.at(-1)]
  }
  return types.join('.')
}
