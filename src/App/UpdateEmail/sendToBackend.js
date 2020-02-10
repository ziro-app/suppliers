import { fbauth, auth, db } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
	try {
		const { pass, newEmail } = state
		const user = auth.currentUser
		const credential = fbauth.EmailAuthProvider.credential(user.email, pass)
		await user.reauthenticateWithCredential(credential)
		try {
			const snapCollection = await db.collection('').where('uid','==',user.uid).get()
			let docRefCollection
			snapCollection.forEach(doc => docRefCollection = doc.ref)
			const snapUser = await db.collection('users').where('email','==',user.email).get()
			let docRefUser, userApp
			snapUser.forEach(doc => {
				userApp = doc.data().app
				docRefUser = doc.ref
			})
			if (userApp === 'admin') throw { msg: 'Não permitido para admin', customError: true }
			await user.updateEmail(newEmail)
			await docRefCollection.update({ email: newEmail })
			await docRefUser.update({ email: newEmail })
			try {
				await user.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` })
				window.alert('Email atualizado! Acesse a confirmação na sua caixa de entrada e refaça o login')
				window.location.replace('/')
				await auth.signOut()
			} catch (error) {
				throw error
			}
		} catch (error) {
			if (error.response) console.log(error.response)
			throw error
		}
	} catch (error) {
		if (error.response) console.log(error.response)
		if (error.code) {
			switch (error.code) {
				case 'auth/network-request-failed': reject({ msg: 'Sem conexão com a rede', customError: true })
				case 'auth/invalid-email': reject({ msg: 'Email inválido', customError: true })
				case 'auth/user-disabled': reject({ msg: 'Usuário bloqueado', customError: true })
				case 'auth/user-not-found': reject({ msg: 'Usuário não cadastrado', customError: true })
				case 'auth/wrong-password': reject({ msg: 'Senha incorreta', customError: true })
				case 'auth/email-already-in-use': reject({ msg: 'Email já cadastrado', customError: true })
				case 'auth/operation-not-allowed': reject({ msg: 'Operação não permitida', customError: true })
				case 'auth/too-many-requests': reject({ msg: 'Muitas tentativas. Tente mais tarde', customError: true })
			}
		} else reject(error)
	}
})

export default sendToBackend