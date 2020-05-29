import axios from 'axios'
import { db } from '../../../Firebase/index';
import moment from 'moment'
import 'moment/locale/pt-br'

const sendToBackend = (sellerId, receitaTotal, setUrl, data, setLoad) => async () => {
        const arrayBillets = data.values.map(item => {
            const {boleto, romaneio, valor, vencimento, comissao, venda, lojista, receita, status } = item
            return {
                boletId:boleto,
                romaneio,
                data_venda:venda,
                lojista,
                valor,
                comissao,
                receita,
                vencimento,
                status
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
            const createBoleto = await axios(configBoletos)
            const urlBoleto = createBoleto.data.payment_method.url
            console.log(data.fabricante)
            const docRef = await db.collection('duplicate').add({
                fabricante: data.fabricante,
                id_transaction:createBoleto.data.id,
                status:'Aguardando Pagamento',
                date: moment(new Date()).format("DD/MMM./YY"),
                url: urlBoleto,
                billets: arrayBillets
            })
            const doc = await docRef.get()
            setUrl(urlBoleto)
            await setLoad(false)
            console.log(doc)
        } catch (error) {
            console.log(error)
        }
}

export default sendToBackend