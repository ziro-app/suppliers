import currencyFormat from '@ziro/currency-format';
import { dateFormat, getFilterQuery } from './utils';
import matchStatusColor from './matchStatusColor';

const fetch = (state) => {
    const {statusFilter, monthFilter, clientFilter, limitFetch:limit, setIsLoadingResults, setIsLoading, setErrorLoading, setPayments, zoopId, setTotalTransactions, setLoadingMore, docId, isCollaborator} = state
    const storageFilterClient = clientFilter || localStorage.getItem('clientFilter')
    const storageFilterStatus = statusFilter || localStorage.getItem('statusFilter')
    const storageFilterMonth = monthFilter || localStorage.getItem('monthFilter')
    const query = () => {
        if(isCollaborator){
            return  getFilterQuery({storageFilterClient, storageFilterStatus, storageFilterMonth}).where('sellerZoopId', '==', zoopId).where('collaboratorId', '==', docId).limit(limit);
        }
        return getFilterQuery({storageFilterClient, storageFilterStatus, storageFilterMonth}).where('sellerZoopId', '==', zoopId).limit(limit);;
    }

    const run = async () => {
        try {
            await query().onSnapshot(
                async snapshot => {
                    const getCollection = () => {
                        if(isCollaborator){
                            return getFilterQuery({storageFilterClient, storageFilterStatus, storageFilterMonth}).where('sellerZoopId', '==', zoopId).where('collaboratorId', '==', docId).get();
                        }
                           return getFilterQuery({storageFilterClient, storageFilterStatus, storageFilterMonth}).where('sellerZoopId', '==', zoopId).get();
                        
                    }
                    const collectionData = await getCollection()
                    setTotalTransactions(collectionData.docs.length);
                    const paymentDoc = [];
                    const datesList = [];
                    const clientsList = [];
                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            const {
                                charge,
                                date,
                                fees,
                                installments,
                                dateLinkCreated,
                                transactionZoopId,
                                installmentsMax,
                                sellerZoopId,
                                status,
                                buyerRazao,
                                receivables,
                                receiptId,
                                dateLastUpdate,
                                sellerZoopPlan,
                                insurance,
                                observations,
                                splitTransaction
                            } = doc.data();
                            const chargeFormatted = currencyFormat(charge);
                            const dateFormatted = dateLastUpdate ? dateFormat(dateLastUpdate) : '';
                            clientsList.push(buyerRazao)
                            datesList.push(dateLinkCreated)
                            paymentDoc.push({
                                transactionZoopId: transactionZoopId || '',
                                transactionId: doc.id,
                                charge: chargeFormatted,
                                dateLinkCreated,
                                date: dateFormatted,
                                fees: fees || '',
                                installments: installments || '',
                                installmentsMax: installmentsMax || '',
                                seller: buyerRazao || '-',
                                sellerZoopId: sellerZoopId || '',
                                status: status || '',
                                statusColor: matchStatusColor(status),
                                buyerRazao,
                                receivables: receivables || [],
                                receiptId: receiptId || '',
                                sellerZoopPlan: sellerZoopPlan || '',
                                insurance: insurance || false,
                                observations,
                                splitTransaction
                            });
                        });
                        setPayments([...paymentDoc]);
                        setIsLoadingResults(false)
                    } else {
                        setPayments([]);
                    }
                    setIsLoading(false);
                    setLoadingMore(false);
                    setIsLoadingResults(false)
                    setIsLoading(false);
                    setLoadingMore(false);
                    setIsLoadingResults(false)
                },
                error => {
                    console.log(error);
                    setIsLoading(false);
                    setLoadingMore(false);
                    setIsLoadingResults(false)
                    setIsLoading(false);
                    setLoadingMore(false);
                    setIsLoadingResults(false)
                },
            );
        } catch (error) {
            console.log(error);
            setErrorLoading(true);
            setIsLoading(false);
            setLoadingMore(false);
            setIsLoadingResults(false)
            setIsLoading(false);
            setLoadingMore(false);
            setIsLoadingResults(false)
            
        }
    };
    run();
};

export default fetch;
