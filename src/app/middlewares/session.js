//barreira para o usuario só conseguir acessar a pagina de anuncio se estiver logado
function redirectToLogin(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/users/login')

    next()
}

//se o usuario ja estiver cadastrado redirecionar para usuario
function isLoggedRedirectToLogin(req, res, next) {
    if (req.session.userId)
        return res.redirect('/users')

    next()

}

module.exports = {
    redirectToLogin,
    isLoggedRedirectToLogin
}