import { post } from 'axios';
import { db } from '../../Firebase/index';

const url = process.env.SHEET_URL
const config = {
    headers: {
        'Content-type': 'application/json',
        'Authorization': process.env.SHEET_TOKEN
    }
}

const sendToBackend = state => () => {
    const { zoopId, userPos, docId, cnpj, holderName, bankName,
        bankNumber, newAgency, newAccountNumber,
        accountTypeViewName, newAccountType, setBankName,
        setBankNumber, setNewAgency, setNewAccountNumber,
        setAccountTypeViewName, setNewAccountType } = state;
    const body = {
        apiResource: 'values',
        apiMethod: 'update',
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        range: `Base!Q${userPos}:U${userPos}`,
        resource: {
            values: [
                [
                    accountTypeViewName,
                    bankNumber.startsWith('0') ? `'${bankNumber}` : bankNumber,
                    holderName,
                    `'${newAgency}`,
                    newAccountNumber
                ]
            ]
        },
        valueInputOption: 'user_entered'
    }

    return new Promise(async (resolve, reject) => {
        try {
            try {
                // Atualizando usuário na planilha
                await post(url, body, config);
                try {
                    // Criando token da conta
                    const responseAccount = await post(
                        `${process.env.PAY_URL}token-bank-create`,
                        {
                            ein: cnpj,
                            bank_code: bankNumber,
                            holder_name: holderName,
                            routing_number: newAgency,
                            account_number: newAccountNumber,
                            type: newAccountType
                        }, {
                        headers: {
                            Authorization: `${process.env.PAY_TOKEN}`,
                        },
                    });
                    // Associando conta ao vendedor
                    const responseAssociating = await post(
                        `${process.env.PAY_URL}bank-associate`,
                        {
                            customer: zoopId,
                            token: responseAccount.data.id
                        }, {
                        headers: {
                            Authorization: `${process.env.PAY_TOKEN}`,
                        },
                    });
                    try {
                        // Atualizando registro no Firestore
                        await db.collection('suppliers').doc(docId).update({
                            nomeBanco: bankName.includes(' - ') ? bankName.split(' - ')[1] : bankName,
                            codBanco: bankNumber,
                            tipoConta: accountTypeViewName,
                            titular: holderName,
                            numConta: newAccountNumber,
                            agencia: newAgency,
                            zoopBankAccountId: responseAssociating.data.id
                        });
                        setBankName('');
                        setBankNumber('');
                        setNewAgency('');
                        setNewAccountNumber('');
                        setAccountTypeViewName('');
                        setNewAccountType('');
                        resolve('Atualizado com sucesso');

                    } catch (error) {
                        console.log(error);
                        if (error.customError) throw error
                        if (error.response) console.log(error.response)
                        throw { msg: 'Erro ao atualizar dados. Fale com seu assessor', customError: true };
                    }
                } catch (error) {
                    if (error.customError) throw error
                    throw { msg: 'Erro ao atualizar conta. Fale com seu assessor', customError: true }
                }
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao atualizar. Tente novamente.', customError: true }
            }
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
