import { fbauth, auth, db } from '../../Firebase/index'
import { post } from 'axios'

const sendToBackend = state => () => {
    const { isCollaborator, zoopId, row, pass, newEmail } = state
    const url = process.env.SHEET_URL
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        range: isCollaborator ? `Colaboradores!C${row}` : `Base!D${row}`,
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        resource: {
            values: [[newEmail.toLowerCase()]]
        },
        valueInputOption: 'raw'
    }
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            if (row) await post(url, body, config)
            try {
                const user = auth.currentUser
                const credential = fbauth.EmailAuthProvider.credential(user.email, pass)
                await user.reauthenticateWithCredential(credential)
                try {
                    let snapCollection;
                    let docRefCollection;
                    const snapUser = await db.collection('users').where('email', '==', user.email).get()
                    let docRefUser, userApp
                    snapUser.forEach(doc => {
                        userApp = doc.data().app
                        docRefUser = doc.ref
                    });
                    if (userApp === 'admin') throw { msg: 'Não permitido para admin', customError: true }
                    if (isCollaborator) {
                        snapCollection = await db.collection('collaborators').where('uid', '==', user.uid).get();
                        snapCollection.forEach(doc => docRefCollection = doc.ref);
                    } else {
                        snapCollection = await db.collection('suppliers').where('uid', '==', user.uid).get();
                        snapCollection.forEach(doc => docRefCollection = doc.ref);
                    }
                    await user.updateEmail(newEmail.toLowerCase());
                    await docRefCollection.update({ email: newEmail.toLowerCase() });
                    await docRefUser.update({ email: newEmail.toLowerCase() });
                    if (!isCollaborator) {
                        await post(
                            `${process.env.PAY_URL}sellers-update?seller_id=${zoopId}`,
                            {
                                owner: {
                                    email: newEmail.toLowerCase()
                                }
                            }, {
                            headers: {
                                Authorization: `${process.env.PAY_TOKEN}`,
                            },
                        });
                    }
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
        } catch (error) {
            if (error.customError) {
                setError(error)
                reject(error)
            }
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        }
    })
}

export default sendToBackend
