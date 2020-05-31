import axios from 'axios'
import { db } from '../../../Firebase/index';

const sendToBackend = (sellerId, receitaTotal, setUrl, data, setLoad,razao) => async () => {
        const arrayBillets = data.values.map(item => {
            const { boleto, romaneio, valor, vencimento, comissao, venda, lojista, receita, status,rua,polo } = item
            return {
                boletId:boleto,
                romaneio,
                data_venda:venda,
                lojista,
                valor,
                comissao,
                receita,
                vencimento,
                status,
                rua,
                polo
            }
        })
        try {
            await setLoad(true)
            const configBoletos = {
                method: 'POST',
                url: process.env.ZOOP_URL_BOLETO,
                data : {
                    'amount': receitaTotal,
                    'currency': 'BRL',
                    'description': 'venda',
                    'on_behalf_of': process.env.SELLER_ID_ZIRO,
                    'customer': sellerId,
                    'payment_type': 'boleto'
                },
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Basic ${process.env.ZOOP_TOKEN}`
                }
            }
            let arrayFirebase = []
            let query = db.collection('boleto-payments').where('fabricante', '==', razao)
            const snap = await query.get()
            snap.forEach((doc) => {
                    arrayFirebase.push(1)
                })
            const createBoleto = await axios(configBoletos)
            const urlBoleto = createBoleto.data.payment_method.url
            const objeto = {
                'fantasia': data.fabricante,
                'transactionZoopId': createBoleto.data.id,
                'status': 'Aguardando Pagamento',
                'date': new Date(),
                'counter': arrayFirebase.length+1,
                'url': urlBoleto,
                'billets': arrayBillets
            }
            const docRef = await db.collection('boleto-payments').add(objeto)
            const doc = await docRef.get()
            const obj = {
                status:'Aguardando Pagamento'
            }
            await db.collection('pending_commission').doc(razao).update(obj)
            setUrl(urlBoleto)
            await setLoad(false)
            console.log(doc)
        } catch (error) {
            console.log(error)
        }
}

export default sendToBackend