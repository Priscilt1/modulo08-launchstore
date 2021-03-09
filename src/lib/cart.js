const { formatPrice } = require('./utils')

//carinho fica guardado na sessao (req.session)

const Cart = {
    init(oldCart) {
        if(oldCart) {
            this.items = oldCart.items //[{ product: {}. price, quantity, formatted, {} }]
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
    addOne(product) {    //adicionar 1 item ao carrinho
        //ver se um produto ja existe no carrinho 
        let inCart = this.items.find(item => item.product.id == product.id)

        //se nao existir 
        if (!inCart) {
            inCart = {
                product: {
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }

            this.items.push(inCart)
        }

        // para nao colocar mais quantidade no carrinho sem ter estoque suficiente
        if(inCart.quantity >= product.quantity) return this 

        //Atualizando item
        inCart.quantity++ //atualizando o item no carrinho
        inCart.price = inCart.product.price * inCart.quantity //multiplicando o preco de acordo com a quantidade
        inCart.formattedPrice = formatPrice(inCart.price)
        
        //Atualizando carrinho
        this.total.quantity++ //atualizando o carrinho 
        this.total.price += inCart.product.price //somando o preco no carrinho
        this.total.formattedPrice = formatPrice(this.total.price)

        return this

    },
    removeOne(productId) {
    //remover 1 item do carrinho 
    },
    delete(productId) {
    //deletar todo item
    }
}

const product = {
    id: 1,
    price: 199,
    quantity: 2
}

console.log(Cart.init().addOne(product))

module.exports = Cart