import { db } from '../../Firebase/index'

const sendToBackend = state => () => {
    const { seller, sellerId, charge, maxInstallments, docId, setCharge, setMaxInstallments } = state
    const baseUrl = 'https://catalogo.ziro.app/transacao?doc='
    return new Promise(async (resolve, reject) => {
        try {
            if (seller && sellerId) {
                const docRef = await db.collection('suppliers').doc(docId)
                    .collection('payments').add({
                        seller,
                        sellerZoopId: sellerId,
                        charge,
                        maxInstallments,
                        status: 'Aguardando Pagamento'
                    })
                try {
                    const doc = await docRef.get()
                    if (doc) await navigator.clipboard.writeText(`${baseUrl}${doc.id}&sel=${docId}`)
                } catch (error) {
                    console.log(error)
                    reject('Error in clipboard API')
                }
                resolve('Link copiado')
                setCharge('')
                setMaxInstallments('')
            } else {
                throw { msg: 'Vendedor não encontrado', customError: true }
            }
        } catch (error) {
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject('Erro ao criar cobrança')
            }
        }
    })

}

export default sendToBackend