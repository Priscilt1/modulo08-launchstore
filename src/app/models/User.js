const db = require('../../config/db')
const {hash} = require('bcryptjs') //pegando a biblioteca para criptografia das senhas
// const { update } = require('../controllers/UserController')
const fs = require('fs') //FileSistem para deletar os arquivos do usuario
const Product = require('../models/Product')


module.exports = {
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            //WHERE | OR | AND
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
    async create(data) {
        try{
            const query = `
            INSERT INTO users (
                name,
                email,
                password, 
                cpf_cnpj,
                cep, 
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `
            //hash de senha - criptografia de senha 
            // instalando a biblioteca bcryptjs
            const passwordHash = await hash(data.password, 8) //a força da senha sera 8

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ''),
                data.cep.replace(/\D/g, ''),
                data.address
            ]

            const results = db.query(query, values)
            return (await results).rows[0].id
        }catch(err) {
            console.error(err)
        }
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        //pegar todos os produtos
        let results = await Product.all()
        const products = results.rows

        //dos produtos, pegar todas as imagens/arquivos
        const allFilesPromise = products.map(product =>
            Product.files(product.id))

        let promiseResults = await Promise.all(allFilesPromise) //array com as promessas resolvidas

        //rodar a remocao do usuario 
        await db.query('DELETE FROM users WHERE id = $1', [1])

        //remover as imagens da pasta public
        promiseResults.map(results => { //lembrando que é um result para cada produto, ou seja, cada produto com os arquivos
            results.rows.map(file => fs.unlinkSync(file.path))
        })

    }
}