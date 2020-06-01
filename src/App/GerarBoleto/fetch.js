import axios from 'axios'
import { db } from '../../Firebase/index'
import matchStatusColor from './utils/matchStatusColor'
import moment from 'moment'
import 'moment/locale/pt-br'

const fetch = (state) => {
    const { setIsLoading, setIsError, seller, setfisrtTicket, setTicket } = state
    console.log(seller)
    let query = db.collection('boleto-payments').where('fantasia', '==', seller)
    let queryFirst = db.collection('pending-commission').where('fantasia', '==', seller)
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            let fetchFirebase = []
            let billetFirebase = []
            const snap = await query.get()
            snap.forEach((doc) => {
                const arrayReceitas = doc.data().billets.map((item) => {
                    if(typeof item.receita === 'number'){
                        return item.receita
                    }else{
                        return Number(item.receita.replace('.','').replace(',','.'))
                    }
                })
                const totalReceitas = arrayReceitas.reduce((a,b) => a+b)
                const soma = (Math.round(totalReceitas*100)/100).toLocaleString()
                billetFirebase.push({
                    contador: doc.data().counter,
                    id:doc.data().transactionZoopId,
                    charge: soma,
                    date: doc.data().status === 'Aguardando Pagamento' ? '-' : moment(doc.data().date_payment.toDate()).format('DD/MM/YY'),
                    seller:`Relatório ${doc.data().counter}`,
                    status:doc.data().status,
                    statusColor: matchStatusColor(doc.data().status)
                })
                fetchFirebase.push({
                    contador: doc.data().counter,
                    id:doc.data().transactionZoopId,
                    fabricante:doc.data().fantasia,
                    status:doc.data().status,
                    date_payment: doc.data().date_payment,
                    values:doc.data().billets,
                    relatorio: `Relatório ${doc.data().counter}`,
                    url: doc.data().url,
                    endereco: `${doc.data().billets[0].polo} - ${doc.data().billets[0].rua}`
                })
            })
            const snapFirst = await queryFirst.get()
            let firstInfo = []
            let firstTicket = []
            snapFirst.forEach((doc) => {
                const arrayReceitas = doc.data().billets.map((item) => {
                    if(typeof item.receita === 'number'){
                        return item.receita
                    }else{
                        return Number(item.receita.replace('.','').replace(',','.'))
                    }
                })
                const totalReceitas = arrayReceitas.reduce((a,b) => a+b)
                const soma = (Math.round(totalReceitas*100)/100).toLocaleString()
                firstInfo.push({
                    id:'relatorio_futuro',
                    charge: soma,
                    date: '-',
                    seller:'Relatório Futuro',
                    status:doc.data().status,
                    statusColor: matchStatusColor(doc.data().status)
                })
                firstTicket.push({
                    contador: 'Futuro',
                    id:'relatorio_futuro',
                    fabricante:doc.data().fantasia,
                    status:doc.data().status,
                    values:doc.data().billets,
                    relatorio: 'Relatório Futuro',
                    endereco: `${doc.data().billets[0].polo} - ${doc.data().billets[0].rua}`
                })
            })
            function ordenar(a,b){
                if(a.contador>b.contador) return -1
                if(a.contador<b.contador) return 1
            }
            const orderFetch = fetchFirebase.sort((a,b) => ordenar(a,b))
            const orderBillet = billetFirebase.sort((a,b) => ordenar(a,b))
            if(firstTicket[0].status !== 'Comissões em Aberto'){
                setfisrtTicket([...orderFetch])
                setTicket([...orderBillet])    
            }else{
                setfisrtTicket([...firstTicket,...orderFetch])
                setTicket([...firstInfo,...orderBillet])
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