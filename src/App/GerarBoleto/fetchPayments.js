import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import { formatDateUTC3 } from '@ziro/format-date-utc3'
import { db } from '../../Firebase/index'
import matchStatusColor from './utils/matchStatusColor'

const fetchPayments = (state) => {
    const {setIsError, seller, setPaymentDuplicatas, setPaymentBoletos, setFinishPayments, setIsLoading } = state
    const queryPayments = db.collection('comission-payments').where('fantasia', '==', seller)
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            queryPayments.onSnapshot(
                async snapPayments => {
                    const paymentDuplicatas = []
                    const paymentBoletos = []
                    setIsLoading(true)
                    if (!snapPayments.empty) {
                        snapPayments.forEach((doc) => {
                            const arrayReceitas = doc.data().billets.map((item) => {
                                if(typeof item.receita === 'number'){
                                    return item.receita
                                }
                                    return Number(item.receita.replace('.','').replace(',','.'))
                                
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
                    }
                    setPaymentDuplicatas(paymentDuplicatas)
                    setPaymentBoletos(paymentBoletos)
                    setIsLoading(false)
                })
                setFinishPayments(true)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetchPayments