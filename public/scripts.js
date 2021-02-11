// MASCARA DINHEIRO - FORMATANDO INPUT DO PREÇO
const Mask = {
    apply(input, func) {
        // deixando a função dinamica
        setTimeout(function(){
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        // tirando tudo que nao é numero quando o usuario for digitar - expressao regular
        value = value.replace(/\D/g,"")

        // formatando o dado para real
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', //ex:1.000,00
            currency: 'BRL' //R$
        }).format(value/100)
    }
}

// logica para pegar no maximo 6 fotos
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        // fazendo com que a fileList se transforme em um array 
        Array.from(fileList).forEach(file => {
           
            // criando array
            PhotosUpload.files.push(file)
            
            const reader = new FileReader()

            // onload é um atributo que usamos quando queremos disparar um evento quando qualquer elemento tenha sido carregado. 
            reader.onload = () => {
                const image = new Image() //como se estivesse criando uma tag no HTML <img>  (formato blob = imagem em formato de texto)
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
            
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    // regras de limitações
    hasLimit (event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        // lenght quantidade/tamanho
        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            // bloquando o evento
            event.preventDefault()
            return true
        }


        const photosDiv = []
        // para cada childNode, rode como novo filho/item
        // preview é o container todo e o childNode é cada foto
        preview.childNodes.forEach(item => {
            // para add só fotos
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert (`Você atingiu o limete máximo de ${uploadLimit} fotos!`)
            event.preventDefault()
            return true
        }

        return false
    },
    // pegando os arquivos
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        // adicionando dataTransfer
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
    
        return dataTransfer.files
    },
    getContainer (image) {
        const div = document.createElement('div')
        div.classList.add ('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton () {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        // parentNode é quem esta a cima, nesse caso, a div com a class photo
        const photoDiv = event.target.parentNode // event.target <i> e o parentNode <div class="photo">
        // o children é a lista
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        // remover um item do Array
        PhotosUpload.files.splice(index, 1)
        // atualizando dados
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},` // concatenar para virar uma string
            }
        }
        photoDiv.remove()
        
    }
}

// galeria de imagens na pagina show 
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'), // pegando a imagem em destaque, que no caso, é a primeira
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const { target } = event

        // removendo a classe active de todas as imagens 
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        // colocando a classe ativa 
        target.classList.add("active")

        // trocando a imagem em destaque
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

// para dar zoom 
const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    }, 
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}