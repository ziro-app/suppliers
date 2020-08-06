import { post } from 'axios'
import { fbauth, auth, db } from '../../Firebase/index'

const sendToBackend = state => () => new Promise(async (resolve, reject) => {
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: process.env.SHEET_TOKEN,
        },
    };
    try {
        const { userPos, isCollaborator, zoopId, pass } = state
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
            })
            if (userApp === 'admin') throw { msg: 'Não permitido para admin', customError: true }
            if (userApp !== 'suppliers') throw { msg: 'Não cadastrado no app', customError: true }
            if (isCollaborator) {
                snapCollection = await db.collection('collaborators').where('uid', '==', user.uid).get();
                snapCollection.forEach(doc => docRefCollection = doc.ref);
            } else {
                snapCollection = await db.collection('suppliers').where('uid', '==', user.uid).get();
                snapCollection.forEach(doc => docRefCollection = doc.ref);
            }
            await docRefCollection.delete()
            await docRefUser.delete()
            try {
                if (!isCollaborator) {
                    await post(`${process.env.PAY_URL}sellers-delete?seller_id=${zoopId}`, {}, {
                        headers: {
                            Authorization: `${process.env.PAY_TOKEN}`
                        }
                    });
                } else if (isCollaborator && userPos && userPos > 0) {
                    const body = {
                        apiResource: 'values',
                        apiMethod: 'update',
                        range: `Colaboradores!E${userPos}`,
                        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
                        resource: {
                            values: [['Excluído']]
                        },
                        valueInputOption: 'raw'
                    }
                    await post(url, body, config);
                }
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
