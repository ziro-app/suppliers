import { db } from '../../../Firebase'
import getDataFees from './getDataFees'
import planName from './planName'

const fetch = async(
    zoopId,
    setLoading,
    setError,
    setDataRows,
    brands,
    setBlockDetails
) => {  
    try {
        setLoading(true)
        const query = db.collection('suppliers').where('zoopId', '==', zoopId)
        query.onSnapshot(
            async snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const data = doc.data().sellerZoopPlan2
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
                                        title: 'Condição de recebimento',
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
                    })
                }
            }
        )
        setLoading(false)
    } catch (error) {
        setError(true)
        setLoading(false)
    }
}

export default fetch