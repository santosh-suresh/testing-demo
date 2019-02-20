const Ajv = require('ajv')

const beerSchema = require('./beer.json')
const reviewSchema = require('./review.json')

const ajv = new Ajv({ allErrors: true })
ajv.addSchema(beerSchema)
ajv.addSchema(reviewSchema)

module.exports = ajv
