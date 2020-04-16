import { auth, db } from '../../Firebase/index'
import { post } from 'axios'
import { dateHourFormatterUTC3 } from '../utils'

const sendToBackend = state => () => {
	const { name, lastName, cnpj, birthdate, phone, street, number, complement,
		neighborhood, cep, city, cityState, email, pass } = state
	const phoneTrim = phone ? `55 ${phone.trim()}` : ''
	const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`
	const fnameTrim = name ? name.trim() : ''
	const lnameTrim = lastName ? lastName.trim() : ''
	const today = new Date()
	const url = process.env.SHEET_URL
	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		range: 'Fabricantes!A1', // Only for tests
		resource: {
			spreadsheetId: '1x6T_309HUNijByr1B_2Ofi0oFG3USyTAWH66QV-6L-0', // Only for tests
			values: [
				[dateHourFormatterUTC3(today), `${fnameTrim} ${lnameTrim}`, cnpj, birthdate, phoneTrim,
					endereco, neighborhood, cep, city, cityState, email]
			]
		},
		valueInputOption: 'user_entered'
	}
	const config = {
		headers: {
			'Content-type': 'application/json',
			'Authorization': process.env.SHEET_TOKEN
		}
	}
	return new Promise(async (resolve, reject) => {
		try {
			await post(url, body, config)
			try {
				const { user } = await auth.createUserWithEmailAndPassword(email, pass)
				try {
					await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
					try {
						await db.collection('suppliers').add({
							cadastro: today,
							uid: user.uid,
							fname: fnameTrim,
							lname: lnameTrim,
							cnpj,
							nascimento: birthdate,
							phone: phoneTrim,
							endereco,
							bairro: neighborhood,
							cep,
							cidade: city,
							estado: cityState,
							email
						})
						await db.collection('users').add({ email, app: 'suppliers' })
						try {
							await auth.signOut() // user needs to validate email before signing in to app
						} catch (error) {
							console.log(error)
							if (error.response) console.log(error.response)
							throw 'Erro ao fazer signOut'
						}
					} catch (error) {
						console.log(error)
						if (error.response) console.log(error.response)
						throw 'Erro ao salvar na Firestore'
					}
				} catch (error) {
					console.log(error)
					if (error.response) console.log(error.response)
					throw 'Erro ao enviar email de verificação'
				}
			} catch (error) {
				console.log(error)
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
			window.location.assign('/confirmar-email')
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

export default sendToBackend