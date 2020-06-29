import { post } from 'axios';
import { auth, db } from '../../Firebase/index';
const { formatDateUTC3 } = require('@ziro/format-date-utc3');

const sendToBackend = state => () => {
    const { fname, lname, email, pass, docId, supplierId, role } = state;
    const nomeCompleto = (fname && lname) ? `${fname.trim()} ${lname.trim()}` : '';
    const today = new Date();
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    };
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        range: 'Colaboradores!A1',
        resource: {
            values: [[formatDateUTC3(today), nomeCompleto, email, supplierId, 'Aprovado', role]]
        },
        valueInputOption: 'user_entered'
    };

    return new Promise(async (resolve, reject) => {
        try {
            try {
                const doc = await db.collection('collaborators').doc(docId).get();
                if (doc.exists) {
                    // Cadastrando usuário na planilha
                    await post(url, body, config);
                    try {
                        // Cadastrando no Firebase Auth
                        const { user } = await auth.createUserWithEmailAndPassword(email, pass);

                        // Atualizando o registro na collection
                        await db.collection('collaborators').doc(docId).update({
                            cadastro: today,
                            uid: user.uid,
                            status: 'Aprovado'
                        });

                        // Enviando email de verificação
                        try {
                            await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` });
                            await db.collection('users').add({ email, app: 'suppliers' })
                            try {
                                await auth.signOut() // user needs to validate email before signing in to app
                            } catch (error) {
                                if (error.response) console.log(error.response)
                                throw 'Erro ao fazer signOut'
                            }
                        } catch (error) {
                            if (error.customError) throw error
                            if (error.response) console.log(error.response)
                            throw 'Erro ao enviar email de verificação'
                        }
                    } catch (error) {
                        if (error.customError) throw error
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
                } else throw { msg: 'Link inválido', customError: true };
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao ao salvar usuário. Tente novamente.', customError: true }
            }
            window.location.assign('/confirmar-email')
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

export default sendToBackend;
