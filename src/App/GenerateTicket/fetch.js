import axios from 'axios'
import { db } from '../../Firebase/index'
import matchStatusColor from './matchStatusColor'
import moment from 'moment'
import 'moment/locale/pt-br'

const fetch = (setIsLoading, setIsError, razao, setfisrtTicket, setTicket) => {
    let query = db.collection('duplicate').where('fantasia', '==', razao)
    let queryFirst = db.collection('pending_commission').where('fantasia', '==', razao)
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
                let contador = counter++
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
                    id:doc.data().transactionZoopId,
                    charge: soma,
                    date: '-',
                    seller:'Relatório Futuro',
                    status:doc.data().status,
                    statusColor: matchStatusColor(doc.data().status)
                })
                firstTicket.push({
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
            const baseCharge = arrayObject(dataCharge.valueRanges[0])
            const charge = baseCharge.filter(charge => charge.fornecedor === razao)
            const totalReceita = charge.reduce((a, b) => ({receita: a.receita + b.receita}))
            const firstTicket = [
                {
                    id: 1,
                    seller: 'Relatório Futuro',
                    charge: (Math.round(totalReceita.receita*100)/100).toLocaleString(),
                    status: 'Comissões em Aberto',
                    statusColor: matchStatusColor('Comissões em Aberto')
                }
            ]
            setfisrtTicket([{id:1,fabricante:razao,relatorio:'Relatório Futuro', status: 'Comissões em Aberto', values:charge},...fetchFirebase])
            setTicket([...firstTicket,...billetFirebase])
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