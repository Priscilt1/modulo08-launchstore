async function post (req, res, next) {
    const keys = Object.keys(req.body)// validacao para saber se os campos estão preenchidos
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Por favor, volte e preencha todos os campos!')
        }
    }

    if(!req.files || req.files.length == 0)  // configuração para armanezamento da imagem 
        return res.send('Por favor, selecione no minino uma imagem!')

    next()

}

async function put (req, res, next) {
    const keys = Object.keys(req.body)        
    for (key of keys) {                    
        if (req.body[key] == "" && key != "removed_files") {                
            return res.send('Por favor, volte e preencha todos os campos!')
        }
    }
    next()
}


module.exports = {
    post,
    put
}