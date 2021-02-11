// configuracao do muter
const multer = require('multer')

// pegando a funcao "salvar arquivo em disco"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb é callback
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        // colocando uma data na frente para que o nome do arquivo seja unico
        cb(null, `${Date.now().toString()}-${file.originalname}`)
    } 
})

// vendo se o arquivo realmente é uma imagem - png, jgep...
const fileFilter = (req, file, cb) => {
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
    .find(acceptedFormat => acceptedFormat == file.mimetype)
    // para cada arquivo, ver se encontrou a extensão (png, jepg...)

    // (se for da extensao esta ok)
    if(isAccepted) {
        return cb(null, true)
    }

    return cb(null, false)
}

module.exports = multer({
    storage,
    fileFilter    
})