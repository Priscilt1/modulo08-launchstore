// entendendo sobre heranca 

class Person {
    getName () {
        return this.name
    }
}

class Dev extends Person {
    constructor(name) {
        super() //o super pega tudo da classe
        this.name = name 
    }
}

const dev = new Dev ("diego")
console.log(dev.getName())