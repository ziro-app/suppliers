import { auth, db } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
    try {
        const { email } = state
        let userApp;
        const userRef = await db.collection('users').where('email', '==', email).get();
        userRef.forEach(user => userApp = user.data().app);
        if (userApp !== 'suppliers') throw { msg: 'Não cadastrado no app', customError: true };
        await auth.sendPasswordResetEmail(email)
        resolve('Enviado com sucesso!')
    } catch (error) {
        console.log(error)
        if (error.response) console.log(error.response)
        if (error.code) {
            switch (error.code) {
                case 'auth/network-request-failed': reject({ msg: 'Sem conexão com a rede', customError: true })
                case 'auth/invalid-email': reject({ msg: 'Email inválido', customError: true })
                case 'auth/user-disabled': reject({ msg: 'Usuário bloqueado', customError: true })
                case 'auth/user-not-found': reject({ msg: 'Usuário não cadastrado', customError: true })
                case 'auth/wrong-password': reject({ msg: 'Senha incorreta', customError: true })
                case 'auth/too-many-requests': reject({ msg: 'Muitas tentativas. Tente mais tarde', customError: true })
            }
        } else reject(error)
    }
})

export default sendToBackend
