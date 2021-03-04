const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')


module.exports = {
    async index(req, res) {
        try {
            let { filter, category } = req.query

            if( !filter || filter.toLowerCase() == 'toda a loja') filter = null 

            let products = await Product.search({filter, category})

            const productsPromise = products.map(LoadProductService.format) //passando a funcao para o map  

            products = await Promise.all(productsPromise)

            const search = {
                term: filter || 'Toda a loja',
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