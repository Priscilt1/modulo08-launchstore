// express-session connect-pg-simple instalar as biblioteca para a sessao de usuario 
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session ({
    store: new pgSession ({
        pool:db
    }),
    secret: 'pridu',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000 // o tempo maximo que a sessao vai ter (sao 30 dias convertidos em milesegundos) 
    }
})