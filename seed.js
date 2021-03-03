// dados fakes 
const faker = require ('faker') //rodar no termina; a instalação da biblioteca faker (node.js)
const { hash } = require('bcryptjs')

const User = require ('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')

let usersIds = []
let totalProducts = 10
let totalUsers = 3

async function createUsers() {
    const users = []
    const password = await hash('1111', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(9999999999),
            cep: faker.random.number(99999999999),
            address: faker.address.streetName(),
        })
    }

    const usersPromise = users.map(user => User.create(user)) //array de promesa

    usersIds = await Promise.all(usersPromise) //aguardando as promeses serem resolvidas

}

async function createProducts() {
    let products = []

    while(products.length < totalProducts) {
        products.push ({
            category_id: Math.ceil(Math.random() * 3), //numero aleatorio e inteiro (arrendodado para cima por causa do ceil) de 1 a 3
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],  //numero aleatorio e inteiro (arrendodado para baixo por causa do floor) de 0 a 2 (por causa do array que sempre comeca com 0)
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            old_price: faker.random.number(999999),
            price: faker.random.number(999999),
            quantity: faker.random.number(99),
            status: Math.round(Math.random()) //o math random vai dar de 0 a 1, e o round vai arrendodar para o numero que estiver mais proximo
        })
    }

    const productsPromise = products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromise)

    let files = []

    while(files.length < 50) {
        files.push ({
            name: faker.image.image(), //coloca a url de imagem fake 
            path: 'public/images/placeholder.png', //para deixar uma imagem fixa para todos 
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
    }

    const filesPromise = files.map(file => File.create(file))
    await Promise.all(filesPromise)
}

async function init() { //para executar as funçÕes na ordem certinha. Primeiro usuarios, depois produtos
    await createUsers()
    await createProducts()
}

init()