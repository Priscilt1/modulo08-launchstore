const { formatPrice } = require('../../lib/utils')
const Product = require('../models/Product')


module.exports = {
    async index(req, res) {
        // pegando os produtos
        try {
            let results,
                params = {}

            const { filter, category } = req.query

            // verficando se tem filtro
            if(!filter) return res.redirect('/')
            params.filter = filter 

            // verificando se tem a categoria
            if (category) {
                params.category = category
            }

            results = await Product.search(params)

            async function getImage(productId) {
                let results = await Product.files(productId) 
                const files = results.rows.map( file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            const productsPromise = results.rows.map(async product => {
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price)
                return product
            })

            const products = await Promise.all(productsPromise)

            const search = {
                term: req.query.filter,
                total: products.length
            }

            // pegando as categorias
            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
                // o reduce precisa de uma callback function e falar qual resultado que quer. Nesse caso, será um array. O mesmo resultado será passado como argumento
            })).reduce((categoriesFilterd, category) => {
                
                // Só coloquei mais um na categoria se o nome for diferente do que eu ja tenho impresso na tela
                const found = categoriesFilterd.some(cat => cat.id == category.id)

                if(!found)
                    categoriesFilterd.push(category)

                return categoriesFilterd
            }, []) //sempre precisa retornar o objeto final no reduce. No caso, um objeto de categoria contendo o ID e o name

            return res.render("search/index", {products, search, categories})
        }
        
        catch(err) {
            console.error(err)
        }

    }
}