const db = require('../../config/db')
// const { delete } = require('./File')
const { create } = require('./User')

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },
    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `
            
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    }, 
    async create(fields) { // será um objeto 
        try {
            let keys = "",
                values = ""

            Object.keys(fields).map(key => {
                //keys = chave = name, age, address 
                //values = 'Priscila', '25', 'Rua auhuhaushhasoshaoi'
                keys.push(key) //transformando em um array, colocando a virgula necessaria na posicao dos valores
                values.push(fields[key])

                const query = `INSERT INTO ${this.table} (${keys.join(',')})
                    VALUES (${values.join(',')})
                    RETURNING id `

                const results = await db.query(query) 
                return results.rows[0].id

            })
        } catch(error) {
            console.error(error)
        }
    },
    async update(id, fields) {
        try{
            let update = []

            Object.keys(fields).map(key => {
                //category_id=($1)
                const line = `${key} = '${fields[key]}'`
                update.push(line)

            })
            
            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`
    
            return db.query(query)


        }catch(error) {
            console.error(error)
        }
    },
    delete(id) {
         db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
    }
}

module.exports = Base