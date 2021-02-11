import { db, auth } from '../../Firebase/index'

const appName = {
    'affiliate': 'afiliados',
    'catalog': 'catálogo',
    'operation': 'interno'
}

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
    try {
        const { email, pass } = state
        const snapshot = await db.collection('users').where('email', '==', email).get()
        let userApp
        snapshot.forEach(doc => userApp = doc.data().app)
        if (!(userApp === 'suppliers' || userApp === 'admin')) {
            let app = appName[userApp] || '';
            throw { msg: app ? `Não cadastrado no app. Cadastrado no app ${app}` : 'Não cadastrado no app', customError: true }
        }
        //
        try {
            const { user: { emailVerified } } = await auth.signInWithEmailAndPassword(email, pass)
            if (!emailVerified) {
                await auth.signOut()
                throw { msg: 'Acesse o email de confirmação', customError: true }
            }
            window.location.replace('/inicio')
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case 'auth/network-request-failed': throw { msg: 'Sem conexão com a rede', customError: true }
                    case 'auth/invalid-email': throw { msg: 'Email inválido', customError: true }
                    case 'auth/user-disabled': throw { msg: 'Usuário bloqueado', customError: true }
                    case 'auth/user-not-found': throw { msg: 'Usuário não cadastrado', customError: true }
                    case 'auth/wrong-password': throw { msg: 'Senha incorreta', customError: true }
                    case 'auth/too-many-requests': throw { msg: 'Muitas tentativas. Tente mais tarde', customError: true }
                }
            } else throw error
        }
    } catch (error) {
        if (error.response) console.log(error.response)
        reject(error)
    }
})

export default sendToBackend
