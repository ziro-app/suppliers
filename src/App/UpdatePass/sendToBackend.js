import { fbauth, auth } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
	try {
		const { pass, newPass, setPass, setNewPass, setConfirmPass } = state
		const user = auth.currentUser
		const credential = fbauth.EmailAuthProvider.credential(user.email, pass)
		await user.reauthenticateWithCredential(credential)
		try {
			await user.updatePassword(newPass)
			setPass('')
			setNewPass('')
			setConfirmPass('')
			resolve('Senha atualizada!')
		} catch (error) {
			console.log(error)
			if (error.response) console.log(error.response)
			throw error
		}
	} catch (error) {
		console.log(error)
		if (error.response) console.log(error.response)
		if (error.code) {
			switch (error.code) {
				case 'auth/network-request-failed': reject({ msg: 'Sem conexão com a rede', customError: true })
				case 'auth/wrong-password': reject({ msg: 'Senha incorreta', customError: true })
			}
		} else reject(error)
	}
})

export default sendToBackend