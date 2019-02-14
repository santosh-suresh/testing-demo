const http = require('http')

module.exports = http.createServer(handler)

function handler(req, res) {
    const statusCode = req.url === '/not-there' ? 404 : 200
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    if (req.url === '/hello') {
        const response = { hello: "world" }
        res.write(JSON.stringify(response))
    }
    res.end()
}