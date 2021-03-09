const Cart = require('../../lib/cart')
const LoadProductServices = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            const product = await LoadProductServices.load('product', { where : {id: 10}})
            let { cart } = req.session

            //gerenciador de carrinho
            cart = Cart.init(cart).addOne(product) //iniciando o carrinho e retornando o objeto vazio

            return res.render('cart/index', { cart })
        }    
        catch(err) {
            console.error(err)
        }
    }
}