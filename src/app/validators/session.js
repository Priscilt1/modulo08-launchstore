const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    //verificar se o usuario esta cadastrado
    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('session/login', {
        user: req.body, //para ficar preenchido o email
        error: 'Usúario não cadastrado!'
    })

    //verficar se o password esta correto
    const passed = await compare (password, user.password) // descriptografando a senha

    if(!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha invalida'
    })

    //colocar o usuario no req.session
    req.user = user 
    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render('session/forgot-password', {
            user: req.body, 
            error: 'Email não cadastrado!'
        })   

        req.user = user

        next() 
    }catch(err) {
        console.error(err)
    }
}

module.exports = {
   login,
   forgot
}