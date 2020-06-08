import axios from 'axios'
import { db } from '../../Firebase/index'
import matchStatusColor from './utils/matchStatusColor'
import currencyFormat from '@ziro/currency-format'
import { formatDateUTC3 } from '@ziro/format-date-utc3'

const fetch = (state) => {
    const { setIsLoading, setIsError, seller, setfisrtTicket, setTicket } = state
    let queryPayments = db.collection('boleto-payments').where('fantasia', '==', seller)
    let queryPending = db.collection('pending-commission').where('fantasia', '==', seller)
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            let paymentDuplicatas = []
            let paymentBoletos = []
            const snapPayments = await queryPayments.get()
                if (!snapPayments.empty) {
                    snapPayments.forEach((doc) => {
                        const arrayReceitas = doc.data().billets.map((item) => {
                            if(typeof item.receita === 'number'){
                                return item.receita
                            }else{
                                return Number(item.receita.replace('.','').replace(',','.'))
                            }
                        })
                        const arrayPolo = doc.data().billets[0].rua.split(' ')
                        const enderecoSimple = `${arrayPolo[0].replace(',','')}, ${arrayPolo[arrayPolo.length-1]}`
                        const totalReceitas = arrayReceitas.reduce((a,b) => a+b)
                        const [datePayment] = doc.data().date_payment
                            ? formatDateUTC3(new Date(doc.data().date_payment.seconds * 1000)).split(' ')
                            : ''
                        paymentDuplicatas.push({
                            contador: doc.data().counter,
                            id:doc.data().transactionZoopId,
                            charge: currencyFormat(Math.round(totalReceitas * 100 * 100)/100),
                            date: doc.data().status === 'Aguardando Pagamento' ? '-' : `${datePayment.substring(0,6)}${datePayment.substring(8,10)}`,
                            seller:`${doc.data().counter}. ${enderecoSimple}`,
                            status:doc.data().status,
                            statusColor: matchStatusColor(doc.data().status)
                        })
                        paymentBoletos.push({
                            contador: doc.data().counter,
                            id:doc.data().transactionZoopId,
                            fabricante:doc.data().fantasia,
                            status:doc.data().status,
                            date_payment: doc.data().date_payment,
                            values:doc.data().billets,
                            relatorio: `${doc.data().counter}. Relatório ${enderecoSimple}`,
                            url: doc.data().url,
                            endereco: `${doc.data().billets[0].polo} - ${doc.data().billets[0].rua}`
                        })
                    })
                }else{
                    paymentDuplicatas = []
                    paymentBoletos = []
                }
            const snapPending = await queryPending.get()
            let pendingDuplicatas = []
            let pendingBoletos = []
                if (!snapPending.empty) {
                    snapPending.forEach((doc) => {
                        const { pending_polos } = doc.data()
                        if(pending_polos){
                            pending_polos.map((polo) => {
                             const arrayReceitas = polo.billets.map((item) => {
                                 if(typeof item.receita === 'number'){
                                     return item.receita
                                 }else{
                                     return Number(item.receita.replace('.','').replace(',','.'))
                                 }
                             })
                             const arrayPolo = polo.billets[0].rua.split(' ')
                             const enderecoSimple = `${arrayPolo[0].replace(',','')}, ${arrayPolo[arrayPolo.length-1]}`
                             const totalReceitas = arrayReceitas.reduce((a,b) => a+b)
                                if(polo.status === 'Comissões em Aberto'){
                                    pendingDuplicatas.push({
                                        id:polo.transactionZoopId,
                                        charge: currencyFormat(Math.round(totalReceitas*100)),
                                        date: '-',
                                        seller:`${enderecoSimple}`,
                                        status:polo.status,
                                        statusColor: matchStatusColor(polo.status)
                                    })
                                    pendingBoletos.push({
                                        contador: `${polo.counter}`,
                                        id:polo.transactionZoopId,
                                        fabricante:polo.fantasia,
                                        status:polo.status,
                                        values:polo.billets,
                                        relatorio: `Relatório ${enderecoSimple}`,
                                        endereco: `${polo.billets[0].polo} - ${polo.billets[0].rua}`
                                    })
                                }
                            })
                        }else{
                            const arrayReceitas = doc.data().billets.map((item) => {
                            if(typeof item.receita === 'number'){
                                return item.receita
                            }else{
                                return Number(item.receita.replace('.','').replace(',','.'))
                            }
                        })
                        const arrayPolo = doc.data().billets[0].rua.split(' ')
                        const enderecoSimple = `${arrayPolo[0].replace(',','')}, ${arrayPolo[arrayPolo.length-1]}`
                        const totalReceitas = arrayReceitas.reduce((a,b) => a+b)
                        if(doc.data().status === 'Comissões em Aberto'){
                        pendingDuplicatas.push({
                            id:'relatorio_futuro',
                            charge: currencyFormat(Math.round(totalReceitas*100)),
                            date: '-',
                            seller:`${enderecoSimple}`,
                            status:doc.data().status,
                            statusColor: matchStatusColor(doc.data().status)
                        })
                        pendingBoletos.push({
                            contador: 'Futuro',
                            id:'relatorio_futuro',
                            fabricante:doc.data().fantasia,
                            status:doc.data().status,
                            values:doc.data().billets,
                            relatorio: `Relatório ${enderecoSimple}`,
                            endereco: `${doc.data().billets[0].polo} - ${doc.data().billets[0].rua}`
                        })    
                        }
                        }
                    })
                }else{
                    pendingDuplicatas = []
                    pendingBoletos = []
                }   
            if(pendingBoletos[0] || paymentBoletos[0]){
                function ordenar(a,b){
                    if(a.contador>b.contador) return -1
                    if(a.contador<b.contador) return 1
                }
                const orderFetch = paymentBoletos.sort((a,b) => ordenar(a,b))
                const orderBillet = paymentDuplicatas.sort((a,b) => ordenar(a,b))
                if(!pendingBoletos[0]){
                    setfisrtTicket([...orderFetch])
                    setTicket([...orderBillet])    
                }else{
                    setfisrtTicket([...pendingBoletos,...orderFetch])
                    setTicket([...pendingDuplicatas,...orderBillet])
                }
            }else{
                setfisrtTicket([])
                    setTicket([])
            }
            setIsLoading(false)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch