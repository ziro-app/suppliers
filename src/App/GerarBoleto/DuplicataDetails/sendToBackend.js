import axios from 'axios'
import { db } from '../../../Firebase/index';

const sendToBackend = (sellerId, receitaTotal,setUrl,data,setLoad,seller, setIsError) => async () => {
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
                url: `${process.env.PAY_URL}payments-create`,
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
                    'Authorization': process.env.PAY_TOKEN
                }
            }
            let arrayFirebase = []
            let query = db.collection('comission-payments').where('fantasia', '==', seller.toUpperCase())
            let queryPending = db.collection('pending-commission').where('fantasia', '==', seller.toUpperCase())
            const snap = await query.get()
            snap.forEach((doc) => {
                    arrayFirebase.push(doc.data().status)
                })
            const createBoleto = await axios(configBoletos)
            const urlBoleto = createBoleto.data.payment_method.url
            const objeto = {
                'fantasia': data.fabricante.toUpperCase(),
                'transactionZoopId': createBoleto.data.id,
                'status': 'Aguardando Pagamento',
                'date': new Date(),
                'counter': arrayFirebase.length+1,
                'url': urlBoleto,
                'payment_type': 'boleto',
                'billets': arrayBillets
            }
            const snapPending = await queryPending.get()
            let obj = []
            snapPending.forEach((doc) => {
                if(doc.data().pending_polos){
                    let novoArray = [];
                    doc.data().pending_polos.map((item, index) => {
                        if(item.billets[0].rua === arrayBillets[0].rua){
                            novoArray.push({
                                billets:item.billets,
                                fantasia:item.fantasia,
                                polo: item.polo,
                                status: 'Aguardando Pagamento',
                                transactionZoopId: item.transactionZoopId
                            })
                        }else{
                            novoArray.push(item)
                        }
                    })
                    obj.push({
                        pending_polos:novoArray
                    })
                }else{
                    obj.push({
                        status:'Aguardando Pagamento'
                    })
                }
            })
            const docRef = await db.collection('comission-payments').add(objeto)
            const doc = await docRef.get()
            await db.collection('pending-commission').doc(seller).update(...obj)
            setUrl(urlBoleto)
            await setLoad(false)
            console.log(doc)
        } catch (error) {
            console.log(error) 
            setLoad(false)
            setIsError(true)
        }
}

export default sendToBackend