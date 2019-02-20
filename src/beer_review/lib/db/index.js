require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
    query: function (sql, params, cb) {
        return pool.query(sql, params, cb)
    }
}