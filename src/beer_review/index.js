var server = require('./lib/server')
var port = process.env.PORT || 5000
server().listen(port)
console.log("Beer Review", 'listening on port', port)