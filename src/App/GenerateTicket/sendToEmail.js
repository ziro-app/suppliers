import axios from 'axios'
import htmlEmail from './utils/html'

const sendToEmail = state => () => {
    const { url:urlBoleto, charge, email, razao } = state
    return new Promise(async (resolve, reject) => {
        try {
            if (urlBoleto) {
                const configEmail = {
                    method: 'POST',
                    url: 'http://localhost:9000/.netlify/functions/sendEmail',
                    data : {
                        "userEmail":"relatorios.ziro@gmail.com",
                        "pwdEmail":"ziro142536",
                        "email":email,
                        "titulo":`Comissões Ziro ${razao}`,
                        "html": htmlEmail(charge,urlBoleto)
                    },
                    headers: {
                        'Authorization': 'Basic YWhtYWQ6emlybzEyMzQ=',
                        // 'Origin' : 'https://ziro.app',

                    }
                }
                const enviarEmail = await axios(configEmail) 
                console.log(enviarEmail.status)
            } else {
                throw { msg: 'Url não encontrada', customError: true }
            }
        } catch (error) {
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject('Erro ao enviar para o email cadastrado')
            }
        }
    })

}

export default sendToEmail