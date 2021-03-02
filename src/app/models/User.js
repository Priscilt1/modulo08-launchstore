const Base = require('./Base')

Base.init ({ table: 'users '}) //iniciando a tabla (pegando no Base)

const User = {
    ...Base,
}

module.exports = User
