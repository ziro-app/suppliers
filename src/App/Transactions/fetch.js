import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from './matchStatusColor'
import { dateFormat } from './utils';

const fetch = (setIsLoading, setErrorLoading, payments, setPayments, zoopId, limit, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore) => {
    let query = db.collection('credit-card-payments')
        .where('sellerZoopId', '==', zoopId)
        .orderBy('dateLinkCreated', 'desc')
        .limit(limit);
    if (lastDoc) query = query.startAfter(lastDoc);

    const run = async () => {
        try {
            await query.onSnapshot(async snapshot => {
                let collectionData = await db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).get();
                setTotalTransactions(collectionData.docs.length);
                const paymentDoc = [];
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        const { charge, date, fees, installments, dateLinkCreated, transactionZoopId,
                            maxInstallments, sellerZoopId, status, buyerRazao, receivables, receivement, receiptId } = doc.data();
                        const chargeFormatted = currencyFormat(charge);
                        const dateFormatted = date ? dateFormat(date) : '';
                        paymentDoc.push({
                            transactionZoopId: transactionZoopId ? transactionZoopId : '',
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
                            receivables: receivables ? receivables : [],
                            receivement,
                            receiptId: receiptId ? receiptId : '',
                        });
                    });
                    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                    setPayments([...payments, ...paymentDoc]);
                } else {
                    setLastDoc(null);
                    setPayments([]);
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
