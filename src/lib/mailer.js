//biblioteca para mandar os emails para recuperação de senha
//site mailtrap para testar se os emails estão chegando correto
const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "844f01d5213bd1",
      pass: "fef1dea5e0637b"
    }
})

