const express = require ('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
//Controllers (são entendidades)
const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')
 

//Search
routes.get('/search', SearchController.index)
// Products
routes.get ('/create', ProductController.create)
routes.get('/:id', ProductController.show)
routes.get ('/:id/edit', ProductController.edit)
// multer.array("photos", 6) pega a lista de fotos e limita em 6
routes.post('/', multer.array("photos[]", 6), ProductController.post) //postar
routes.put('/',  multer.array("photos[]", 6), ProductController.put) //atualizar
routes.delete('/', ProductController.delete)


module.exports = routes