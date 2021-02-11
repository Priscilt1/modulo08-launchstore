const express = require ('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')


//Controllers (são entendidades)
const ProductController = require('./app/controllers/ProductController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')


//Home
routes.get ('/', HomeController.index)


//Search
routes.get('/products/search', SearchController.index)


// Products
routes.get ('/products/create', ProductController.create)
routes.get('/products/:id', ProductController.show)
routes.get ('/products/:id/edit', ProductController.edit)
// multer.array("photos", 6) pega a lista de fotos e limita em 6
routes.post('/products', multer.array("photos[]", 6), ProductController.post) //postar
routes.put('/products',  multer.array("photos[]", 6), ProductController.put) //atualizar
routes.delete('/products', ProductController.delete)


// ALIAS - ATALHO   
routes.get ('/ads/create', function (req, res) {
    return res.redirect("/products/create")
})


module.exports = routes