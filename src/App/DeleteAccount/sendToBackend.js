import { fbauth, auth, db } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
	try {
		const { pass } = state
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
			await docRefCollection.delete()
			await docRefUser.delete()
			try {
				await user.delete()
				window.location.replace('/')
				await auth.signOut()
			} catch (error) {
				console.log(error)
				if (error.response) console.log(error.response)
				throw error
			}
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