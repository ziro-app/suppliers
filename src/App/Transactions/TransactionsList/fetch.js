import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from './matchStatusColor'

const fetch = (setIsLoading, setErrorLoading, payments, setPayments, zoopId, limit, lastDoc, setLastDoc, setLoadingMore) => {
    let query = db.collection('credit-card-payments')
        .where('sellerZoopId', '==', zoopId)
        .orderBy('dateLinkCreated', 'desc')
        .limit(limit);
    if (lastDoc) query = query.startAfter(lastDoc);

    const run = async () => {
        try {
            await query.onSnapshot(snapshot => {
                const paymentDoc = [];
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const { charge, date, fees, installments, dateLinkCreated,
                            maxInstallments, sellerZoopId, status, buyerRazao, receivables } = doc.data();
                        const chargeFormatted = currencyFormat(charge);
                        const dateFormatted = date ? new Date(date.seconds * 1000)
                            .toLocaleDateString('pt-br', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                            })
                            .replace(' de ', '/') : '';
                        paymentDoc.push({
                            transactionId: doc.id,
                            charge: chargeFormatted,
                            dateLinkCreated,
                            date: dateFormatted,
                            fees: fees ? fees : '',
                            installments: installments ? installments : '',
                            maxInstallments: maxInstallments ? maxInstallments : '',
                            seller: buyerRazao ? buyerRazao : '-',
                            sellerZoopId: sellerZoopId ? sellerZoopId : '',
                            status: status ? status : '',
                            statusColor: matchStatusColor(status),
                            buyerRazao,
                            receivables: receivables ? receivables : []
                        });
                    });
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1])
                    setPayments([...payments, ...paymentDoc]);
                }
                setIsLoading(false);
                setLoadingMore(false);
            }, error => {
                console.log(error);
                setIsLoading(false);
                setLoadingMore(false);
            });
        } catch (error) {
            setErrorLoading(true);
            setIsLoading(false);
            setLoadingMore(false);
        }
    }
    run();
};

export default fetch;
