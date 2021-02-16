// uma classe é um molde de objeto, definindo as suas propriedades e metodos. A classe é um constructor, um construstor de objetos.
class UserController {
    registerForm(req, res) {
        return res.redirect('/products')
    }
}

module.exports = new UserController