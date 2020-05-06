import { db } from '../../Firebase/index'
import axios from 'axios'

const matchStatus = {
    'cancelada': 'Cancelado',
    'aprovada': 'Pago',
    'falhada': 'Falhado'
}

const fetch = (setIsLoading, setIsError, setResult) => {
    const source = axios.CancelToken.source()
    const storeowners = []
    const cnpjInCollection = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: '1FxCECEMVa66vpHsmucgFow6DVPpCGHgOiIfthEzJwPc',
                range: 'Transacoes'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            /*const documents = await db.collection('storeowners').get()
            documents.forEach(document => {
                if (document.data().cnpj !== '')
                    cnpjInCollection.push(document.data().cnpj)
            })*/

            const dataTransactions = await axios(config)
            const [, ...listTransactions] = dataTransactions.data.values

            /* const docRef =  */

            listTransactions.map(async transaction => {
                let charge = transaction[7].replace(/[\.\,]/g, '')
                let fees = transaction[10].replace(/[\.\,]/g, '')
                let date = new Date(`${transaction[1].split('/')[1]}/${transaction[1].split('/')[0]}/${transaction[1].split('/')[2]}`)
                /*await db.collection('suppliers').doc('RzKSwlBDS8DlBE1vwzix')
                    .collection('payments').add({
                        date,
                        charge,
                        status: matchStatus[transaction[2]],
                        maxInstallments: transaction[6],
                        installments: transaction[6],
                        seller: 'Crisfael',
                        brand: transaction[13],
                        cardHolder: transaction[12],
                        cardNumber: transaction[14],
                        fees,

                    })*/
            })
            /*listTransactions.map(storeowner => { //cnpj -> storeowner[8]
                if (!cnpjInCollection.includes(storeowner[8])) {
                    await db.collection('storeowners').add({
                        cadastro: new Date(),
                        nomeAfiliado: storeowner[18] ? storeowner[18] : 'NENHUM',
                        cpfAfiliado: storeowner[19] ? storeowner[19] : '',
                        fname: storeowner[1] ? storeowner[1].split(' ')[0] : '',
                        lname: storeowner[1] ? storeowner[1].split(' ').slice(1).join(' ') : '',
                        rg: storeowner[4] ? storeowner[4] : '',
                        cpf: storeowner[5] ? storeowner[5] : '',
                        nascimento: storeowner[6] ? storeowner[6] : '',
                        instagram: storeowner[7] ? storeowner[7] : '',
                        cnpj: storeowner[8] ? storeowner[8] : '',
                        ie: storeowner[9] ? storeowner[9] : '',
                        razao: storeowner[10] ? storeowner[10] : '',
                        fantasia: storeowner[11] ? storeowner[11] : '',
                        endereco: storeowner[12] ? storeowner[12] : '',
                        bairro: storeowner[13] ? storeowner[13] : '',
                        cep: storeowner[14] ? storeowner[14] : '',
                        cidade: storeowner[15] ? storeowner[15] : '',
                        estado: storeowner[16] ? storeowner[16] : '',
                        fone: storeowner[17] ? storeowner[17] : '',
                        whatsapp: storeowner[2] ? storeowner[2] : '',
                        email: storeowner[3] ? storeowner[3].toLowerCase() : '',
                        assessor: storeowner[20] ? storeowner[20] : '',
                        vendedor: storeowner[21] ? storeowner[21] : ''
                    })
                    cnpjInCollection.push(storeowner[8])
                    storeowners.push(storeowner)
                }
            })

            /*let userFirebase = await db.collection('storeowners').add({
                cadastro: new Date(),
                nomeAfiliado: storeowner[18]? storeowner[18] : 'NENHUM',
                cpfAfiliado: storeowner[19]? storeowner[19] : '',
                fname: storeowner[1] ? storeowner[1].split(' ')[0] : '',
                lname: storeowner[1] ? storeowner[1].split(' ').slice(1).join(' ') : '',
                rg: storeowner[4] ? storeowner[4] : '',
                cpf: storeowner[5] ? storeowner[5] : '',
                nascimento: storeowner[6] ? storeowner[6] : '',
                instagram: storeowner[7] ? storeowner[7] : '',
                cnpj: storeowner[8] ? storeowner[8] : '',
                ie: storeowner[9] ? storeowner[9] : '',
                razao: storeowner[10] ? storeowner[10] : '',
                fantasia: storeowner[11] ? storeowner[11] : '',
                endereco: storeowner[12] ? storeowner[12] : '',
                bairro: storeowner[13] ? storeowner[13] : '',
                cep: storeowner[14] ? storeowner[14] : '',
                cidade: storeowner[15] ? storeowner[15] : '',
                estado: storeowner[16] ? storeowner[16] : '',
                fone: storeowner[17] ? storeowner[17] : '',
                whatsapp: storeowner[2] ? storeowner[2] : '',
                email: storeowner[3] ? storeowner[3].toLowerCase() : '',
                assessor: storeowner[20] ? storeowner[20] : '',
                vendedor: storeowner[21] ? storeowner[21] : ''
            })*/

            setResult(`Um total de X usuários adicionados ao Firebase com sucesso.`)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
            setResult(`Erro ao adicionar usuários ao Firebase.`)
        } finally {
            setIsLoading(false)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
