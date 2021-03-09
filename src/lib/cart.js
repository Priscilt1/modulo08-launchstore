const { formatPrice } = require('./utils')

//carinho fica guardado na sessao (req.session)

const Cart = {
    init(oldCart) {
        if(oldCart) {
            this.items = oldCart.items
            this.total = oldCart.total
        } else {
            this.items = []
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
        }
        return this
    },
    addOne(product) {
    //adicionar 1 item ao carrinho
    },
    removeOne(productId) {
    //remover 1 item do carrinho 
    },
    delete(productId) {
    //deletar todo item
    }
}

module.exports = Cart