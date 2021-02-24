const crypto = require('crypto') // modulo para criação do token

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },
    login(req, res) {
        req.session.userId = req.user.id
        return res.redirect('/users')
    },
    logout(req, res) {
        req.session.destroy() //destruindo a sessao 
        return res.redirect('/')
    },  
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    forgot(req, res) {
        const user = req.user

        //um token para esse usuario
        const token = crypto.randomBytes(20).toString('hex')

        // criar uma expiração
        let now = new Date()
        now = now.setHours(now.getHours() + 1) //1 hora para expirar o token

        await User.update(user.id, {
            reset_token: token,
            reset_token_expires:now
        })

        //enviar um email com um link de recuperação de senha

        // avisar o usuario que enviamos o email

    }
}