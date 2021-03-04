const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')


module.exports = {
    async index(req, res) {
        // pegando os produtos
        try {
            let params = {}

            const { filter, category } = req.query

            // verficando se tem filtro
            if(!filter) return res.redirect('/')
            params.filter = filter 

            // verificando se tem a categoria
            if (category) {
                params.category = category
            }

            let products = await Product.search(params)

            const productsPromise = products.map(LoadProductService.format) //passando a funcao para o map  

            products = await Promise.all(productsPromise)

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