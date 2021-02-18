const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    post(req, res) {
        //verificar se todos os campos estao preenchifos
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }


        //verificar se usuario já existe (pelo o email e cpf/cnpj)
        const {email, cpf_cnpj} = req.body
        const user = await User.findOne({ //passando o filtro como objeto
            where: {
                email
            }, or: {cpf_cnpj}
        })

        //verificar se as duas senhas estão iguais 
    }
}