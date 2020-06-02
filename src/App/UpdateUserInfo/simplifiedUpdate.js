import { post } from 'axios';
import { db } from '../../Firebase/index';

const simplifiedUpdate = (fname, lname, docId, userPos, zoopId, setIsLoading, setError) => () => {
    const nome = fname ? fname.trim() : '';
    const sobrenome = lname ? lname.trim() : '';

    const url = process.env.SHEET_URL
    const config = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': process.env.SHEET_TOKEN
        }
    }
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        range: `Base!B${userPos}`,
        resource: {
            values: [[`${nome} ${sobrenome}`]]
        },
        valueInputOption: 'user_entered'
    }

    return new Promise(async (resolve, reject) => {
        setIsLoading(true)
        try {
            try {
                // Atualizando registro na tabela
                await post(url, body, config)

                try {
                    // Atualizando registro na Zoop
                    await post(
                        `${process.env.PAY_URL}sellers-update?seller_id=${zoopId}`,
                        {
                            owner: {
                                first_name: nome,
                                last_name: sobrenome
                            }
                        }, {
                            headers: {
                                Authorization: `${process.env.PAY_TOKEN}`,
                            },
                        });

                    try {
                        // Atualizando usuário no Firestore
                        await db.collection('suppliers').doc(docId).update({
                            nome,
                            sobrenome
                        });
                        resolve('Atualizado com sucesso');
                    } catch (error) {
                        if (error.response) console.log(error.response)
                        throw 'Erro ao atualizar no Firestore'
                    }
                } catch (error) {
                    throw { msg: 'Erro ao atualizar, tente novamente', customError: true }
                }

            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao atualizar, tente novamente.', customError: true }
            }
        } catch (error) {
            if (error.customError) {
                setError(error.msg)
                reject(error)
            }
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        } finally {
            setIsLoading(false)
        }
    })
}

export default simplifiedUpdate