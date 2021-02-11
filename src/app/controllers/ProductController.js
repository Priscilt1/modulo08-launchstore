const { formatPrice, date } = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')


module.exports = {
    create(req, res) {
        // pegar categorias - FORMATO DE PROMESE            S 
        Category.all()
        // then significa "então" (termo promessa)
        .then(function(results) {
            const categories = results.rows
            return res.render('products/create.njk', { categories })
        }).catch(function(err) {
            // o catch mostra o erro caso a promessa não der certo por algum motivo
            throw new Error (err)
        })
    },
    async post(req, res) {
        // logica para salvar
        // validacao para saber se os campos estão preenchidos
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        // configuração para armanezamento da imagem 

        if(req.files.length == 0)
            return res.send('Por favor, selecione no minino uma imagem!')


        // dados para salvar - req.body
        let results = await Product.create(req.body)
        // ASYNC-AWAIT - permite trabalhar com promises sem a cadeia de thein
        // toda vez que usar o await, precisa colocar o nome async na frente da função
        const productId = results.rows[0].id

        // criando um array de promessas com o map retornando um array
        const filesPromises = req.files.map(file => File.create({...file, product_id: productId}))
        // executando o array
        await Promise.all(filesPromises)

        return res.redirect(`/products/${productId}/edit`)

    },
    async show(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Produto não encontrado!")

        const { day, hour, minutes, month } = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`,
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id) 
        const files = results.rows.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('products/show', {product, files})
    },
    async edit (req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send('Produto não encontrado!')

        // formatação do preço
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        // Categorias
        results = await Category.all()
        const categories = results.rows

        // criando no modulo de produtos os arquivos que serao puxados - popular imagens no front (pagina edicao)
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            // endereco da imagem
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))



        return res.render('products/edit.njk', {product, categories, files})
    },
    async put (req, res) {
        const keys = Object.keys(req.body)        
        for (key of keys) {                    
            if (req.body[key] == "" && key != "removed_files") {                
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
                File.create({...file, product_id: req.body.id}))

                await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")            
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if(req.body.old_price != req.body.price) {
            // vendo se o preço anterior é diferente do atual, se for, pegue o preco anterior e coloque na categoria
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)
        return res.redirect(`/products/${req.body.id}`)
    },
    async delete (req, res) {
        await Product.delete(req.body.id)
        return res.redirect('/products/create')
    }
}