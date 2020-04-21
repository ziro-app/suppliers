import React, { useState, useEffect } from 'react'
import { post } from 'axios'
import { auth, db } from '../Firebase/index'
import { userContext } from './appContext'
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import ErrorBoundary from '@bit/vitorbarbosa19.ziro.error-boundary'
import Router from './Router'

export const App = () => {
	/* Atributos utilizados em outras páginas a serem criados => name, zoopIp  */
	const [loading, setLoading] = useState(true)
	const [errorLoading, setErrorLoading] = useState(false)
	const [uid, setUid] = useState(null)

	const [name, setName] = useState(null)
	const [cnpj, setCnpj] = useState(null)
	const [birthdate, setBirthdate] = useState(null)
	const [phone, setPhone] = useState(null)
	const [address, setAddress] = useState(null)
	const [neighborhood, setNeighborhood] = useState(null)
	const [cep, setCep] = useState(null)
	const [city, setCity] = useState(null)
	const [cityState, setCityState] = useState(null)
	const [email, setEmail] = useState(null)
	const [userPos, setUserPos] = useState(null)
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
		"spreadsheetId": "1x6T_309HUNijByr1B_2Ofi0oFG3USyTAWH66QV-6L-0", // Only for tests
	}

	useEffect(() => {
		let unsubscribe = () => null
		return auth.onAuthStateChanged(async user => {
			if (user && user.emailVerified) {
				setUid(user.uid)
				// Adding event listener
				unsubscribe = db.collection('suppliers').where('uid', '==', user.uid).onSnapshot(snapshot => {
					if (!snapshot.empty) {
						const { fname, lname, cnpj, nascimento, phone, endereco, bairro, cep,
							cidade, estado, email } = snapshot.docs[0].data()
						setName(`${fname} ${lname}`)
						setCnpj(cnpj ? cnpj : '')
						setBirthdate(nascimento ? nascimento : '')
						setPhone(phone ? phone : '')
						setAddress(endereco ? endereco : '')
						setNeighborhood(bairro ? bairro : '')
						setCep(cep ? cep : '')
						setCityState(estado ? estado : '')
						setCity(cidade ? cidade : '')
						setEmail(email ? email : '')
					}
				})
			}
			else {
				unsubscribe()
				setUid('')
				setName('')
				setCnpj('')
				setBirthdate('')
				setPhone('')
				setAddress('')
				setNeighborhood('')
				setCep('')
				setCity('')
				setCityState('')
				setEmail('')
				setUserPos('')
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
							const { fname, lname, cnpj, nascimento, phone, endereco, bairro, cep,
								cidade, estado, email } = doc.data()
							setName(`${fname} ${lname}`)
							setCnpj(cnpj ? cnpj : '')
							setBirthdate(nascimento ? nascimento : '')
							setPhone(phone ? phone : '')
							setAddress(endereco ? endereco : '')
							setNeighborhood(bairro ? bairro : '')
							setCep(cep ? cep : '')
							setCityState(estado ? estado : '')
							setCity(cidade ? cidade : '')
							setEmail(email ? email : '')
							if (userPos === null || userPos === '') {
								const { data: { values } } = await post(url, body, config)
								values.map((user, index) => {
									if (user[2] === cnpj) {
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
		uid, name, cnpj, birthdate, phone, address, neighborhood,
		cep, city, cityState, email, userPos
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