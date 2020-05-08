import React, { useState, useEffect } from 'react'
import { post } from 'axios'
import { auth, db } from '../Firebase/index'
import { userContext } from './appContext'
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import ErrorBoundary from '@bit/vitorbarbosa19.ziro.error-boundary'
import Router from './Router'

export const App = () => {
	const [loading, setLoading] = useState(true)
	const [errorLoading, setErrorLoading] = useState(false)
	const [uid, setUid] = useState(null)
	const [zoopId, setZoopId] = useState(null)
	const [fname, setFName] = useState(null)
	const [lname, setLName] = useState(null)
	const [cpf, setCpf] = useState(null)
	const [cnpj, setCnpj] = useState(null)
	const [birthdate, setBirthdate] = useState(null)
	const [phone, setPhone] = useState(null)
	const [address, setAddress] = useState(null)
	const [neighborhood, setNeighborhood] = useState(null)
	const [cep, setCep] = useState(null)
	const [city, setCity] = useState(null)
	const [cityState, setCityState] = useState(null)
	const [email, setEmail] = useState(null)
	const [reason, setReason] = useState(null)
	const [fantasy, setFantasy] = useState(null)
	const [codBank, setCodBank] = useState(null)
	const [holderName, setHolderName] = useState(null)
	const [accountType, setAccountType] = useState(null)
	const [accountNumber, setAccountNumber] = useState(null)
	const [agency, setAgency] = useState(null)
	const [userPos, setUserPos] = useState(null)
	const [docId, setDocId] = useState(null)
	const [typeRegister, setTypeRegister] = useState(null)
	const url = process.env.SHEET_URL
	const config = {
		headers: {
			'Content-type': 'application/json',
			'Authorization': process.env.SHEET_TOKEN
		}
	}
	const body = {
		"apiResource": "values",
		"apiMethod": "get",
		"range": "Fabricantes",
		"spreadsheetId": process.env.SHEET_SUPPLIERS_ID
	}

	useEffect(() => {
		let unsubscribe = () => null
		return auth.onAuthStateChanged(async user => {
			if (user && user.emailVerified) {
				setUid(user.uid)
				// Adding event listener
				unsubscribe = db.collection('suppliers').where('uid', '==', user.uid).onSnapshot(snapshot => {
					if (!snapshot.empty) {
						const { nome, sobrenome, cpf, cnpj, nascimento, telefone, endereco, bairro, cep,
							cidade, estado, email, codBanco, titular, tipoConta, numConta, agencia,
							fantasia, razao, zoopId, tipoCadastro } = snapshot.docs[0].data()
						setDocId(snapshot.docs[0].id)
						setFName(nome ? nome : '')
						setLName(sobrenome ? sobrenome : '')
						setCpf(cpf ? cpf : '')
						setCnpj(cnpj ? cnpj : '')
						setBirthdate(nascimento ? nascimento : '')
						setPhone(telefone ? telefone : '')
						setAddress(endereco ? endereco : '')
						setNeighborhood(bairro ? bairro : '')
						setCep(cep ? cep : '')
						setCityState(estado ? estado : '')
						setCity(cidade ? cidade : '')
						setEmail(email ? email : '')
						setCodBank(codBanco ? codBanco : '')
						setHolderName(titular ? titular : '')
						setAccountType(tipoConta ? tipoConta : '')
						setAccountNumber(numConta ? numConta : '')
						setAgency(agencia ? agencia : '')
						setFantasy(fantasia ? fantasia : '')
						setReason(razao ? razao : '')
						setZoopId(zoopId ? zoopId : '')
						setTypeRegister(tipoCadastro ? tipoCadastro : '')
					}
				})
			}
			else {
				unsubscribe()
				setUid('')
				setDocId('')
				setFName('')
				setLName('')
				setCpf('')
				setCnpj('')
				setBirthdate('')
				setPhone('')
				setAddress('')
				setNeighborhood('')
				setCep('')
				setCity('')
				setCityState('')
				setEmail('')
				setCodBank('')
				setHolderName('')
				setAccountType('')
				setAccountNumber('')
				setAgency('')
				setFantasy('')
				setReason('')
				setZoopId('')
				setTypeRegister('')
			}
		})
	}, [])
	useEffect(() => {
		const getUserData = async () => {
			if (uid) {
				try {
					const docRef = await db.collection('suppliers').where('uid', '==', uid).get()
					if (!docRef.empty) {
						docRef.forEach(async doc => {
							const { nome, sobrenome, cpf, cnpj, nascimento, telefone, endereco, bairro, cep,
								cidade, estado, email, codBanco, titular, tipoConta, numConta, agencia,
								fantasia, razao, zoopId, tipoCadastro } = doc.data()
							setDocId(doc.id)
							setFName(nome ? nome : '')
							setLName(sobrenome ? sobrenome : '')
							setCpf(cpf ? cpf : '')
							setCnpj(cnpj ? cnpj : '')
							setBirthdate(nascimento ? nascimento : '')
							setPhone(telefone ? telefone : '')
							setAddress(endereco ? endereco : '')
							setNeighborhood(bairro ? bairro : '')
							setCep(cep ? cep : '')
							setCityState(estado ? estado : '')
							setCity(cidade ? cidade : '')
							setEmail(email ? email : '')
							setCodBank(codBanco ? codBanco : '')
							setHolderName(titular ? titular : '')
							setAccountType(tipoConta ? tipoConta : '')
							setAccountNumber(numConta ? numConta : '')
							setAgency(agencia ? agencia : '')
							setFantasy(fantasia ? fantasia : '')
							setReason(razao ? razao : '')
							setZoopId(zoopId ? zoopId : '')
							setTypeRegister(tipoCadastro ? tipoCadastro : '')
							if (userPos === null || userPos === '') {
								const { data: { values } } = await post(url, body, config)
								values.map((user, index) => {
									if (user[6] === cnpj) {
										setUserPos(index + 1)
									}
								})
							}
						})
					}
				} catch (error) {
					if (error.response) console.log(error.response)
					else console.log(error)
					setErrorLoading(true)
				}
			}
			if (uid !== null) setLoading(false) // wait uid to be set to either a value or null
		}
		getUserData()
	}, [uid])
	const userData = {
		uid, fname, lname, cpf, cnpj, birthdate, phone, address, neighborhood,
		cep, city, cityState, email, userPos, codBank, holderName, accountType,
		accountNumber, agency, fantasy, reason, zoopId, docId, typeRegister
	}
	if (loading) return <InitialLoader />
	if (errorLoading) return <Error />
	return (
		<ErrorBoundary>
			<userContext.Provider value={userData}>
				<Router isLogged={!!uid} />
			</userContext.Provider>
		</ErrorBoundary>
	)
}