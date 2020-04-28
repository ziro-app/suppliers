import axios, { post } from 'axios'
import { auth, db } from '../../Firebase/index'
import dateHourFormatterUTC3 from '@ziro/format-date-utc3'

export const sendToBackend = state => () => {
	console.log(state)
	return
	const { cnpjValid, cnpj, reason, fantasia, opening, category, cep, street, number,
		complement, neighborhood, city, cityState, name, cpf, email, birthdate, phone, pass } = state
	const phoneTrim = phone ? `55 ${phone.trim()}` : ''
	const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`
	const nomeCompleto = name ? name.trim() : ''
	const today = new Date()
	const url = process.env.SHEET_URL
	const body = {
		apiResource: 'values',
		apiMethod: 'append',
		range: 'Fabricantes!A1', // Only for tests
		resource: {
			spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
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
},
	simplifiedRegistration = state => () => {
		const { name, cpf, birthdate, phone, email, cnpj, cnpjValid } = state
		const nomeCompleto = name ? name.trim() : ''
		const telefone = phone ? '55 ' + phone.trim() : ''
		const lowerEmail = email ? email.toLowerCase() : ''
		const url = process.env.SHEET_URL
		const today = new Date()
		const body = {
			apiResource: 'values',
			apiMethod: 'append',
			spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
			range: 'Fabricantes!A1',
			resource: {
				values: [
					[
						dateHourFormatterUTC3(today),
						nomeCompleto,
						cpf,
						birthdate,
						telefone,
						lowerEmail,
						cnpj
					]
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
		const zoopConfig = {
			url: 'suppliers-create',
			method: 'post',
			params: {},
			baseURL: `http://localhost:9000/.netlify/functions/`, //process.env.ZOOP_URL
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Authorization': process.env.ZOOP_TOKEN,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			data: {
				ein: cnpj,
				owner: {
					first_name: nomeCompleto.split(' ')[0],
					last_name: nomeCompleto.split(' ').slice(1).join(' '),
					email: lowerEmail,
					phone_number: telefone,
					taxpayer_id: cpf,
					birthdate
				}
			}
		}
		console.log(zoopConfig)
		return new Promise(async (resolve, reject) => {
			try {
				if (cnpjValid) {
					try {
						const { id } = await post(
							`http://localhost:9003/.netlify/functions/suppliers-create`,
							{
								ein: cnpj,
								owner: {
									first_name: nomeCompleto.split(' ')[0],
									last_name: nomeCompleto.split(' ').slice(1).join(' '),
									email: lowerEmail,
									phone_number: telefone,
									taxpayer_id: cpf,
									birthdate
								}
							},
							{
								headers: {
									Authorization: `${process.env.ZOOP_TOKEN}`,
								},
							}
						);
						//const { id } = await axios(zoopConfig)
						try {
							const { user } = await auth.createUserWithEmailAndPassword(lowerEmail, pass)
							try {
								await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
								try {
									await db.collection('suppliers').doc(user.uid).set({
										cadastro: today,
										uid: user.uid,
										zoopId: id,
										nomeCompleto,
										cpf,
										nascimento: birthdate,
										telefone,
										email: lowerEmail,
										cnpj
									})
									await db.collection('users').add({ email, app: 'suppliers' })
									await post(url, body, config)
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
					} catch (error) {
						console.log(error)
						throw { msg: 'Erro ao criar usuário na Zoop', customError: true }
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
	},
	uploadImage = (setIsSubmitting, setIsSubmitted, category, sellerId = 'ca88b3e1bfbf4768a358b481161e654b') => async files => {
		setIsSubmitting(true)
		const config = {
			url: `sellers/${sellerId}/documents`,
			method: 'post',
			params: {},
			baseURL: process.env.ZOOP_URL,
			headers: {
				'Authorization': process.env.ZOOP_TOKEN,
				'Content-Type': 'multipart/form-data',
				'Accept': 'application/json'
			},
			data: {}
		}
		const uploadImages = await Promise.all(files.map(async file => {
			try {
				if (file.size === 0) throw 'Empty sized image'
				const formData = new FormData();
				formData.append("file", file);
				formData.append("category", category);
				config.data = formData

				try {
					const { data } = await axios(config)
					setIsSubmitted(true)
					return data
				} catch (error) {
					setIsSubmitted(false)
					if (error.response && error.response.data && error.response.data.error) {
						const { status_code, message } = error.response.data.error
						throw { statusCode: status_code, body: message }
					} else {
						console.log('Unexpected error:', error)
						return {
							statusCode: 500,
							body: JSON.stringify('Internal error. Check logs', null, 4)
						}
					}
				}
			} catch (error) {
				console.log(error)
				return error
			}
		}))
		console.log(uploadImages)
		setIsSubmitting(false)
	}