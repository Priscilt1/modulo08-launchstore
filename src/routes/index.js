const express = require ('express')
const routes = express.Router()
const HomeController = require('../app/controllers/HomeController')

//exportando products
const products = require('./products')
const users = require('./users')//exportando users

routes.get ('/', HomeController.index)
// colocando o /products automaticamente em tudo que foi exportado no arquivo products
routes.use('/products', products)
routes.use('/users', users)

// ALIAS - ATALHO   
routes.get ('/ads/create', function (req, res) {
    return res.redirect("/products/create")
})

routes.get ('/accounts', function (req, res) {
    return res.redirect("/users/register")
})

module.exports = routes