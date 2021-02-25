const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    //verificar se todos os campos estao preenchidos
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body, //para quando der erro, as informçÕes serem mantidas no input para o usuario nao precisar digitar tudo novamente
                error: 'Por favor, preencha todos os campos!'
            }
        }
    }
}
async function show(req, res, next) {
    const { userId: id} = req.session
    const user = await User.findOne({ where: {id} })

    if (!user) return res.render('user/register', {
        error: 'Usúario não encontrado!'
    })

    req.user = user

    next()
}
async function post(req, res, next) {
    //checando se os campos estao preenchidos
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render('user/register', fillAllFields)
    }
 
    //verificar se usuario já existe (pelo o email e cpf/cnpj)
    let {email, cpf_cnpj, password, passwordRepeat} = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '')

    //passando o filtro como objeto
    const user = await User.findOne({ 
        where: { email}, 
        or: {cpf_cnpj}
    })


    if(user) return res.render('user/register', {
        user: req.body, //para quando der errp, as informçÕes serem mantidas no input para o usuario nao precisar digitar tudo novamente
        error: 'Usuário já cadastrado'
    })

    //verificar se as duas senhas estão iguais 
    if(password != passwordRepeat) return res.render('user/register', {
        user: req.body, 
        error: 'As senhas não conferem'
    })

    next()
}
async function update(req, res, next) {
    //checando se os campos estao preenchidos
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render('user/index', fillAllFields)
    }
    
    // verificar se tem senha
    const {id, password} = req.body

    if (!password) return res.render('user/index', {
        user:req.body,
        error: 'Coloque sua senha para atualizar seu cadastro.'
    })

    // verificar se a senha fornecida é compativel
    const user = await User.findOne( {where:{id}} )
    const passed = await compare (password, user.password) // descriptografando a senha

    if(!passed) return res.render('user/index', {
        user: req.body,
        error: 'Senha invalida'
    })

    req.user = user 
    next()
}

module.exports = {
    post,
    show,
    update
}