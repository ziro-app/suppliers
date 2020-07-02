import axios from 'axios'
import currencyFormat from '@ziro/currency-format'
import { db } from '../../Firebase/index'
import matchStatusColor from './utils/matchStatusColor'

const fetchPending = (state) => {
    const {setIsError, seller, setPendingBoletos, setPendingDuplicatas, setFinishPending, setIsLoading } = state
    const queryPending = db.collection('pending-commission').where('fantasia', '==', seller)
    const source = axios.CancelToken.source()
    const run = async () => {
        try {
            await queryPending.onSnapshot(
                async snapPending => {
                    const pendingDuplicatas = []
                    const pendingBoletos = []
                    await setIsLoading(true)
                    if (!snapPending.empty) {
                        snapPending.forEach((doc) => {
                            const { pending_polos } = doc.data()
                            if(pending_polos){
                                pending_polos.map((polo) => {
                                 const arrayReceitas = polo.billets.map((item) => {
                                     if(typeof item.receita === 'number'){
                                         return item.receita
                                     }
                                         return Number(item.receita.replace('.','').replace(',','.'))
                                     
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
                                }
                                    return Number(item.receita.replace('.','').replace(',','.'))
                                
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
                    }
                    setPendingDuplicatas(pendingDuplicatas)
                    setPendingBoletos(pendingBoletos)
                    setIsLoading(false)
                })
                setFinishPending(true)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetchPending