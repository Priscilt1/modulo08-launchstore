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

async function reset(req, res, next) {
    //ver se o usuario existe
    const { email, password, token } = req.body
    const user = await User.findOne({ where: {email} })

    if (!user) return res.render('session/password-reset', {
        user: req.body, 
        token,
        error: 'Usúario não cadastrado!'
    })

    //ver se a senha é compativel
    if(password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'A senha e a repetição da senha estão incorretas'
    })

    //verificar se o token é compativel
    if (token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    //checar se o token nao inspirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user
    next()

}

module.exports = {
   login,
   forgot,
   reset
}