const URL = require('url')
const http = require('http')
const HttpHashRouter = require('http-hash-router')
const ReqLogger = require('req-logger')
const cuid = require('cuid')
const sendJson = require('send-data/json')

const api = require('./api')

const router = new HttpHashRouter()
const logger = ReqLogger()

router.set('/favicon.ico', empty)
router.set('/', { GET: api.index })
router.set('/beers', { GET: api.getBeers, POST: api.addBeer })
router.set('/beers/:id', { PUT: api.updateBeer })
router.set('/beers/:id/reviews', { POST: api.addReview, GET: api.getReviews })

module.exports = function createServer() {
    return http.createServer(handler)
}

function handler(req, res) {
    req.id = cuid()
    logger(req, res, { requestId: req.id }, function (info) {
        console.log(info)
    })
    router(req, res, { query: getQuery(req.url) }, onError.bind(null, req, res))
}

function onError(req, res, err) {
    if (!err) return
    res.statusCode = err.statusCode || 500
    sendJson(req, res, {
        error: err.message || http.STATUS_CODES[res.statusCode]
    })
}

function logError(req, res, err) {
    if (process.env.NODE_ENV === 'test') return

    var logType = res.statusCode >= 500 ? 'error' : 'warn'

    console[logType]({
        err: err,
        requestId: req.id,
        statusCode: res.statusCode
    }, err.message)
}

function empty(req, res) {
    res.writeHead(204)
    res.end()
}

function getQuery(url) {
    return URL.parse(url, true).query
}

