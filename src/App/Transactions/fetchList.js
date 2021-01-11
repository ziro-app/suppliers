import {db} from '../../Firebase'
import {removeDuplicates} from './utils'

const fetchList = (state) => {
    const {
        setListStatus,
        setClientList,
        setFirstDate,
        setErrorLoading,
        zoopId,
        isCollaborator,
        docId
    } = state
    const run = async () => {
        try {
            const gerateQuery = () => {
                if(isCollaborator){
                    return db
                    .collection('credit-card-payments')
                    .orderBy('dateLastUpdate', 'desc')
                    .where('sellerZoopId', '==', zoopId)
                    .where('collaboratorId', '==', docId)
                }
                return db
                    .collection('credit-card-payments')
                    .orderBy('dateLastUpdate', 'desc')
                    .where('sellerZoopId', '==', zoopId)
            }
            const query = gerateQuery()
            const listClients = []
            const listDates = []
            const listStatus = []
            const collectionData = await query.get()
            collectionData.forEach(doc => {
                listClients.push(doc.data().buyerRazao)
                listDates.push(doc.data().dateLastUpdate.toDate())
                listStatus.push(doc.data().status)
            })
            setListStatus(removeDuplicates(listStatus.filter(Boolean)))
            setClientList(removeDuplicates(listClients.filter(Boolean)))
            const minDate = new Date(Math.min.apply(null,listDates));
            setFirstDate(minDate)
        } catch (error) {
            setErrorLoading(true)
        }
    }
    run()
}

export default fetchList