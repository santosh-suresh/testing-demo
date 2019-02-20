const send = require('send-data/json')
const createError = require('http-errors')
const body = require('body/json')
const cuid = require('cuid')

const db = require('./db')
const validator = require('./schema')

module.exports = {
    index,
    getBeers,
    addBeer,
    updateBeer,
    addReview,
    getReviews
}

function index(req, res, opts, cb) {
    console.log(opts)

    send(req, res, { message: "Welcome to the Beer Review Service" })
}

function getBeers(req, res, opts, cb) {
    db.query("select * from beers order by created asc", [], (err, results) => {
        if (err) {
            console.log(err)
            return cb(createError(400, err.detail || err))
        }
        const beers = results.rows.map((r) => {
            const newBeer = Object.assign(r, { shortDescription: r.short_description })
            delete newBeer.short_description
            return newBeer
        })
        send(req, res, { beers, count: beers.length })
    })

}

function addBeer(req, res, opts, cb) {
    body(req, res, function (err, data) {
        if (err) return cb(err, null)
        const beer = Object.assign({ created: new Date() }, data)
        const valid = validator.validate("http://example.com/beer.schema.json", beer)
        const { name, brewery, abv, shortDescription, created } = beer
        if (!valid) {
            return cb(createError(422, validator.errorsText()))
        }
        const query = `insert into beers(name, brewery, abv, short_description, created) 
            values($1, $2, $3,$4, $5) returning *`
        const params = [name, brewery, abv, shortDescription, created]
        db.query(query, params, function (err, result) {
            if (err) {
                if (err.constraint === 'beers_name_brewery_abv_key') {
                    return cb(createError(409, err.detail))
                } else {
                    return cb(createError(400, err.detail || 'Unknown error'))
                }
            }
            send(req, res, { beer: result.rows[0] })
        })
    })
}

function updateBeer(req, res, opts, cb) {
    body(req, res, function (err, data) {
        if (err) return cb(err, null)
        const beer = Object.assign({ id: opts.params.id }, data)
        const valid = validator.validate("http://example.com/beer.schema.json", beer)
        const { id, name, brewery, abv, shortDescription } = beer
        if (!valid) {
            return cb(createError(422, validator.errorsText()))
        }
        const query = `update beers set name = $1, brewery = $2, abv = $3, short_description = $4 where id = $5`;
        const params = [name, brewery, abv, shortDescription, id]
        db.query(query, params, function (err, result) {
            if (err) {
                if (err.constraint === 'beers_name_brewery_abv_key') {
                    return cb(createError(409, err.detail))
                } else {
                    return cb(createError(400, err.detail || 'Unknown error'))
                }
            }
            send(req, res, { beer })
        })
    })
}

function addReview(req, res, opts, cb) {
    body(req, res, function (err, data) {
        if (err) return cb(createError(400, err), null)
        const beerId = opts.params.id
        const review = Object.assign({ created: new Date(), beerId }, data)
        const valid = validator.validate("http://example.com/review.schema.json", review)
        if (!valid) {
            return cb(createError(422, validator.errorsText()))
        }

        const { firstName, lastName, comments, created } = review
        const text = `insert into reviews(first_name,last_name,beer_id,comments,created) 
                        values ($1,$2,$3,$4,$5) returning *`
        const params = [firstName, lastName, beerId, comments, created]
        db.query(text, params, function (err, result) {
            if (err) {
                console.log(err)
                if (err.constraint === 'reviews_first_name_last_name_beer_id_key') {
                    return cb(createError(409, 'Review already exists'))
                } else if (err.constraint === 'reviews_beer_id_fkey') {
                    return cb(createError(404, 'Beer does not exist'))
                } else {
                    return cb(createError(400), err || 'Unknown error')
                }
            }
            send(req, res, { review: result.rows[0] })
        })
    })
}

function getReviews(req, res, opts, cb) {
    const { id } = opts.params
    const query = `select id, first_name as firstName, last_name as lastName, comments, created 
                    from reviews where beer_id = $1 order by created desc`
    db.query(query, [id], function (err, result) {
        if (err) {
            console.log(err)
            return cb(createError(400, err.detail || err))
        }

        const reviews = result.rows.map((r) => {
            const { id, firstname, lastname, created, comments } = r
            return {
                id,
                firstName: firstname,
                lastName: lastname,
                created,
                comments
            }
        })
        send(req, res, { reviews, count: reviews.length })
    })
}