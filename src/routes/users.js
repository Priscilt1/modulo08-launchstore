const express = require ('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/Validators/user')
const SessionValidator = require('../app/Validators/session')
const { isLoggedRedirectToLogin, redirectToLogin} = require('../app/middlewares/session')


//CONTROLE DE USUARIO
//login/logout
routes.get('/login', isLoggedRedirectToLogin, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)


//reset passaword / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


//user register UserControoler - criação, atualização e remocao
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/', redirectToLogin, UserValidator.show, UserController.show)
routes.put('/', UserValidator.update, UserController.update)
routes.delete('/', UserController.delete)

routes.get('/ads', UserController.ads)


module.exports = routes