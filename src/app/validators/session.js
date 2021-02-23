const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    //verificar se o usuario esta cadastrado
    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('user/register', {
        user: req.body, //para ficar preenchido o email
        error: 'Usúario não cadastrado!'
    })

    //verficar se o password esta correto
    const passed = await compare (password, user.password) // descriptografando a senha

    if(!passed) return res.render('user/index', {
        user: req.body,
        error: 'Senha invalida'
    })

    //colocar o usuario no req.session
    req.user = user 
    next()
}

module.exports = {
   login
}