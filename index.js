var path = require('path')
var trumpet = require('trumpet')
var through = require('through')

module.exports = function(file) {
  if (path.extname(file) !== '.svg') return through()

  var out = through(write, end)
  var tr = trumpet()
  var svg = tr.select('svg')
    .createReadStream()
    .once('data', function() {
      out.queue('module.exports = "')
    })

  svg.once('end', function() {
    out.queue('";')
    out.queue(null)
  }).on('data', function(data) {
    data = String(data)
      .replace(/\n\r|\r\n|\n/g, '\\n')
      .replace(/\"/g, '\\"')
    out.queue(data)
  })

  function write(data) {
    return tr.write(data)
  }

  function end() {
    tr.end()
  }

  return out
}
