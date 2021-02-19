const User = require('../models/User')

async function post(req, res, next) {
    //verificar se todos os campos estao preenchifos
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render('user/register', {
                user: req.body, //para quando der errp, as informçÕes serem mantidas no input para o usuario nao precisar digitar tudo novamente
                error: 'Por favor, preencha todos os campos!'
            })
        }
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

module.exports = {
    post
}