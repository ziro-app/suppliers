import axios, { post } from 'axios'
import { auth, db } from '../../Firebase/index'
import dateHourFormatterUTC3 from '@ziro/format-date-utc3'

const url = process.env.SHEET_URL
const config = {
	headers: {
		'Content-type': 'application/json',
		'Authorization': process.env.SHEET_TOKEN
	}
}
const categories = {
	0: 'identificacao',
	1: 'atividade',
	2: 'residencia',
	3: 'cnpj'
}

export const sendToBackend = state => () => {
	const { cnpjValid, cnpj, reason, fantasia, opening, category, cep,
		street, number, complement, neighborhood, city, cityState, fname, lname, cpf, email,
		birthdate, phone, pass, bankNumber, holderName, accountNumber, agency, accountType,
		fileDoc, fileAtv, fileRes, fileCnpj, categoryName, accountTypeViewName } = state
	const nomeCompleto = (fname && lname) ? `${fname.trim()} ${lname.trim()}` : ''
	const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`
	const telefone = phone ? `55 ${phone.trim()}` : ''
	const titular = holderName ? holderName.trim() : ''
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
					email,
					cnpj,
					reason,
					fantasia,
					opening,
					categoryName,
					cep,
					endereco,
					neighborhood,
					city,
					cityState,
					bankNumber,
					accountTypeViewName,
					titular,
					accountNumber,
					agency
				]
			]
		},
		valueInputOption: 'user_entered'
	}

	return new Promise(async (resolve, reject) => {
		try {
			if (cnpjValid) {
				try {
					// Criando vendedor na Zoop
					const { data: { id } } = await post(
						process.env.ZOOP_URL_SELLERS,
						{
							ein: cnpj,
							owner: {
								first_name: fname ? fname.trim() : '',
								last_name: lname ? lname.trim() : '',
								email,
								phone_number: telefone,
								taxpayer_id: cpf,
								birthdate: birthdate.split('/').reverse().join('-')
							},
							business_name: reason,
							business_address: {
								line1: street,
								line2: number,
								line3: complement,
								neighborhood,
								city: city,
								state: cityState,
								postal_code: cep.replace('-', ''),
								country: 'BR'
							},
							business_opening_date: opening.split('/').reverse().join('-'),
							mcc: category
						},
						{
							headers: {
								Authorization: `${process.env.ZOOP_TOKEN}`,
							},
						}
					);

					try {
						// Criando token da conta
						const responseAccount = await post(
							process.env.ZOOP_URL_TOKEN_BANK,
							{
								ein: cnpj,
								bank_code: bankNumber,
								holder_name: titular,
								routing_number: agency,
								account_number: accountNumber,
								type: accountType
							},
							{
								headers: {
									Authorization: `${process.env.ZOOP_TOKEN}`,
								},
							}
						);

						// Associando conta ao vendedor
						await post(
							process.env.ZOOP_URL_BANK_ASSOCIATE,
							{
								customer: id,
								token: responseAccount.data.id
							},
							{
								headers: {
									Authorization: `${process.env.ZOOP_TOKEN}`,
								},
							}
						);

						try {
							// Upload das imagens
							const uploadConfig = {
								url: `?seller_id=${id}`,
								method: 'post',
								params: {},
								baseURL: process.env.ZOOP_URL_UPLOAD_FILE,
								headers: {
									'Authorization': process.env.ZOOP_TOKEN,
									'Content-Type': 'multipart/form-data',
									'Accept': 'application/json'
								},
								data: {}
							}
							let i = 0
							await Promise.all([fileDoc, fileAtv, fileRes, fileCnpj].map(async file => {
								try {
									if (file.size === 0) throw 'Empty sized image'
									const formData = new FormData();
									formData.append("file", file);
									formData.append("category", categories[i]);
									uploadConfig.data = formData
									await axios(uploadConfig)
									i += 1
								} catch (error) {
									console.log(error)
									throw { msg: `Erro no upload da imagem ${i + 1}`, customError: true }
								}
							}))

							try {
								const { user } = await auth.createUserWithEmailAndPassword(email, pass)
								try {
									await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
									try {
										await db.collection('suppliers').doc(user.uid).set({
											cadastro: today,
											uid: user.uid,
											zoopId: id,
											nome: fname ? fname.trim() : '',
											sobrenome: lname ? lname.trim() : '',
											cpf,
											nascimento: birthdate,
											telefone: phone,
											email,
											cnpj,
											razao: reason,
											fantasia,
											abertura: opening,
											categoria: categoryName,
											cep,
											endereco,
											bairro: neighborhood,
											cidade: city,
											estado: cityState,
											codBanco: bankNumber,
											tipoConta: accountTypeViewName,
											titular,
											numConta: accountNumber,
											agencia: agency
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
							throw { msg: 'Erro no upload das imagens. Fale com seu assessor', customError: true }
						}
					} catch (error) {
						console.log(error)
						throw { msg: 'Erro ao criar conta bancária. Fale com seu assessor', customError: true }
					}
				} catch (error) {
					console.log(error)
					throw { msg: 'Erro ao criar usuário. Tente novamente', customError: true }
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
	simplifiedRegistration = state => () => {
		const { fname, lname, email, cnpj, cnpjValid, pass, reason, fantasia,
			opening, cep, street, number, complement, neighborhood, city, cityState } = state
		const nomeCompleto = (fname && lname) ? `${fname.trim()} ${lname.trim()}` : ''
		const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`
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
						,
						,
						,
						email,
						cnpj,
						reason,
						fantasia,
						opening,
						,
						cep,
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
						const { data: { id } } = await post(
							process.env.ZOOP_URL_SELLERS,
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
								},
								business_opening_date: opening.split('/').reverse().join('-')
							},
							{
								headers: {
									Authorization: `${process.env.ZOOP_TOKEN}`,
								},
							}
						);
						try {
							const { user } = await auth.createUserWithEmailAndPassword(email, pass)
							try {
								await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
								try {
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
										abertura: opening,
										cep,
										endereco,
										bairro: neighborhood,
										cidade: city,
										estado: cityState
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
						throw { msg: 'Erro ao criar usuário na Zoop. Tente novamente', customError: true }
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