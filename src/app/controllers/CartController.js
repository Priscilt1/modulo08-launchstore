const Cart = require('../../lib/cart')
const LoadProductServices = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            let { cart } = req.session

            //gerenciador de carrinho
            cart = Cart.init(cart)//iniciando o carrinho e retornando o objeto vazio

            return res.render('cart/index', { cart })
        }    
        catch(err) {
            console.error(err)
        }
    },
    async addOne(req, res) {
        //pegar o id do produto e o produto
        const { id } = req.params
        
        const product = await LoadProductServices.load('product', { where : { id }})

        //pegar o carrinho da sessao 
        let { cart } = req.session

        //adicionar o produto ao carrinho usando o gerenciador de carrinho
        cart = Cart.init(cart).addOne(product)

        //atualizar o carrinho da sessao
        req.session.cart = cart

        //redirecionar o usuario para a tela do carrinho 
        return res.redirect('/cart')
    }
}