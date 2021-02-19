const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    async post(req, res) {
        //verificar se todos os campos estao preenchifos
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
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

        if(user) return res.send('Usuario já existente')

        //verificar se as duas senhas estão iguais 
        if(password != passwordRepeat)
            return res.send('Coloque a mesma senha')

        return res.send('Passou')
    }
}