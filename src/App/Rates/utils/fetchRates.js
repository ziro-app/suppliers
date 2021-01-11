import { db } from '../../../Firebase'
import { FailureMessage } from './promptMessages'
import getDataFees from './getDataFees'
import planName from './planName'

const fetch = async(
    zoopId,
    setLoading,
    setError,
    setDataRows,
    brands,
    setBlockDetails,
    setMessage,
) => {
    try {
        setLoading(true)
        const query = db.collection('suppliers').where('zoopId', '==', zoopId)
        query.onSnapshot(
            async snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const data = doc.data().sellerZoopPlan
                        if(data && data.activePlan){
                            const { activePlan } = data
                            const details = [
                                {
                                    header: 'Informações Gerais',
                                    body: [
                                        {
                                            title: 'Plano ativo',
                                            content: planName(activePlan).name
                                        },
                                        {
                                            title: 'Recebimento',
                                            content: planName(activePlan).description
                                        },
                                        {
                                            title: 'Parcelamento máx',
                                            content: `${doc.data().maxParcelas}x`
                                        },
                                        {
                                            title: 'Parcelamento máx sem juros',
                                            content: `${doc.data().maxParcelas}x`
                                        },
                                    ]
                                }
                            ]
                            setBlockDetails(details)
                            const dataPlan = data[activePlan]
                            const arrayDatas = getDataFees(dataPlan, brands, activePlan)
                            setDataRows(arrayDatas)
                        }else{
                            setError(true)
                        }
                    })
                }
            }
        )
        setLoading(false)
    } catch (error) {
        setMessage(FailureMessage('Ocorreu um erro inesperado.'))
        setError(true)
        setLoading(false)
    }
}

export default fetch
