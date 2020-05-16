import { post } from 'axios'
import { auth, db } from '../../Firebase/index'
import dateHourFormatterUTC3 from '@ziro/format-date-utc3'

const simplifiedRegistration = state => () => {
    const { fname, lname, email, cnpj, cnpjValid, pass, reason, fantasia,
        cep, street, number, complement, neighborhood, city, cityState } = state
    const nomeCompleto = (fname && lname) ? `${fname.trim()} ${lname.trim()}` : ''
    const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`
    const today = new Date()
    let cepSplit = cep.split('')
    cepSplit.splice(2, 0, '.')
    const dotCep = cepSplit.join('')
    const url = process.env.SHEET_URL
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        range: 'Base!A1',
        resource: {
            values: [
                [
                    dateHourFormatterUTC3(today),
                    nomeCompleto,
                    ,
                    ,
                    ,
                    email,
                    cnpj,
                    reason,
                    fantasia,
                    dotCep,
                    endereco,
                    neighborhood,
                    city,
                    cityState
                ]
            ]
        },
        valueInputOption: 'user_entered'
    }

    return new Promise(async (resolve, reject) => {
        try {
            if (cnpjValid) {
                try {
                    // Criando registro na tabela
                    await post(url, body, config)

                    try {
                        // Criando registro no Firebase Auth
                        const { user } = await auth.createUserWithEmailAndPassword(email, pass)

                        try {
                            // Enviando email de confirmação
                            await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })

                            try {
                                // Criando registro na Zoop
                                const { data: { id } } = await post(
                                    `${process.env.ZOOP_URL}sellers-create`,
                                    {
                                        ein: cnpj,
                                        owner: {
                                            first_name: fname ? fname.trim() : '',
                                            last_name: lname ? lname.trim() : '',
                                            email
                                        },
                                        business_name: reason,
                                        business_address: {
                                            line1: street,
                                            line2: number,
                                            line3: complement,
                                            neighborhood,
                                            city,
                                            state: cityState,
                                            postal_code: cep.replace('-', ''),
                                            country: 'BR'
                                        }
                                    }, {
                                        headers: {
                                            Authorization: `${process.env.PAY_TOKEN}`,
                                        },
                                    });

                                try {
                                    // Adicionando usuário no Firestore
                                    await db.collection('suppliers').doc(user.uid).set({
                                        cadastro: today,
                                        uid: user.uid,
                                        zoopId: id,
                                        nome: fname ? fname.trim() : '',
                                        sobrenome: lname ? lname.trim() : '',
                                        email,
                                        cnpj,
                                        razao: reason,
                                        fantasia,
                                        cep: dotCep,
                                        endereco,
                                        bairro: neighborhood,
                                        cidade: city,
                                        estado: cityState,
                                        tipoCadastro: 'Simplificado'
                                    })
                                    // Adicionando usuário nos users
                                    await db.collection('users').add({ email, app: 'suppliers' })

                                    try {
                                        await auth.signOut() // user needs to validate email before signing in to app
                                    } catch (error) {
                                        if (error.response) console.log(error.response)
                                        throw 'Erro ao fazer signOut'
                                    }
                                } catch (error) {
                                    if (error.response) console.log(error.response)
                                    throw 'Erro ao salvar na Firestore'
                                }


                            } catch (error) {
                                throw { msg: 'Erro ao criar usuário na Zoop. Tente novamente', customError: true }
                            }

                        } catch (error) {
                            if (error.response) console.log(error.response)
                            throw 'Erro ao enviar email de verificação'
                        }

                    } catch (error) {
                        if (error.customError) throw error
                        if (error.code) {
                            switch (error.code) {
                                case 'auth/network-request-failed': throw { msg: 'Sem conexão com a rede', customError: true }
                                case 'auth/invalid-email': throw { msg: 'Email inválido', customError: true }
                                case 'auth/email-already-in-use': throw { msg: 'Email já cadastrado', customError: true }
                                case 'auth/operation-not-allowed': throw { msg: 'Operação não permitida', customError: true }
                                case 'auth/weak-password': throw { msg: 'Senha fraca. Mínimo 6 caracteres', customError: true }
                            }
                        }
                        throw 'Erro ao criar usuário'
                    }

                } catch (error) {
                    if (error.customError) throw error
                    throw { msg: 'Erro ao salvar usuário. Tente novamente.', customError: true }
                }
                window.location.assign('/confirmar-email')
            } else {
                throw { msg: 'Cnpj inválido', customError: true }
            }
        } catch (error) {
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        }
    })
}

export default simplifiedRegistration