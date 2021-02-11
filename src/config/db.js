// conexão com o banco de dados

const { Pool } = require("pg")

module.exports = new Pool({
    user:"priscilaribeiro",
    password:"",
    host: "localhost",
    port: 5432,
    database:"launchstoredb"
})