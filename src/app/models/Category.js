const db = require('../../config/db')

module.exports = {
    all() {
        // FORMATO DE PROMESS
        return db.query (`
            SELECT * FROM categories
        `)
    }
}