const User = require('../models/User')

const { hash } = require('bcryptjs')

const crypto = require('crypto') // modulo para criação do token (do proprio node)
const mailer = require('../../lib/mailer') //biblioteca para criação dos emails 

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
    async forgot(req, res) {
        const user = req.user

        try {
        //um token para esse usuario
        const token = crypto.randomBytes(20).toString('hex')

        // criar uma expiração
        let now = new Date()
        now = now.setHours(now.getHours() + 1) //1 hora para expirar o token

        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: now
        })

        //enviar um email com um link de recuperação de senha
        await mailer.sendMail({
            to: user.email,
            from: 'no-reply@launchstore.com.br',
            subject: 'Recuperação de senha',
            html: `<h2> Perdeu a chave?</h2>
            <p> Não se preocupe, click no link abaixo para sua senha</p>
            <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `
        })

        // avisar o usuario que enviamos o email
        return res.render('session/forgot-password', {
            success: 'Verifique o seu email cadastrado para resetar a senha!'
        })

        }catch(err) {
            console.error(err) 
            return res.render('session/forgot-password', {
                error: 'Erro inesperando. Tente novamente!'
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body
        try{
            //criar um novo hash de senha
            const newPassword = await hash(password, 8)

            //atualiza o usuario
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            //avisa ao usuario que ele tem uma nova senha
            return res.render('session/login', {
                user:req.body,
                success: 'Senha atualizada! Faça seu login :)'
            })


        }catch(err){
        console.error(err) 
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperando. Tente novamente!'
            })
        }
    }
}