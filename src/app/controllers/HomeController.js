const { formatPrice } = require('../../lib/utils')
const Product = require('../models/Product')


module.exports = {
    async index(req, res) {

        try {
            let results = await Product.all()
            const products = results.rows

            if(!products) return res.send("Produtos não encontrados!")

            // pegando a imagem
            async function getImage(productId) {
                let results = await Product.files(productId) 
                // retornando os caminhos das imagens
                const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // cadeia de promessas (retorna array). Lembrar que isso é uma functions
            const productsPromise = products.map(async product => {
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price)
                return product
            }).filter((product, index) => index > 2 ? false : true) // se chama ternario. (maneira de fazer condicionais)

            const lastAdded = await Promise.all(productsPromise)
            return res.render('home/index', { products: lastAdded})
        }
        catch(err) {
            console.error(err)
        }

    }
}