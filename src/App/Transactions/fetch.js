import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';
import matchStatusColor from './matchStatusColor'

const fetch = (setIsLoading, setErrorLoading, payments, setPayments, zoopId, limit, lastDoc, setLastDoc, totalTransactions, setTotalTransactions, setLoadingMore) => {
    let query = db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).limit(limit);
    if (lastDoc) query = query.startAfter(lastDoc);

    const run = async () => {
        try {
            if (totalTransactions === -1) {
                let collectionData = await db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).get();
                setTotalTransactions(collectionData.docs.length);
            }
            const snap = await query.get();
            const paymentDoc = [];
            snap.forEach(doc => {
                const { cardHolder, cardNumber, charge, date, expectedDate, fees, installment,
                    installments, maxInstallments, seller, sellerZoopId, status } = doc.data();
                const chargeFormatted = currencyFormat(charge);
                const dateFormatted = date ? new Date(date.seconds * 1000)
                    .toLocaleDateString('pt-br', {
                        day: '2-digit',
                        month: '2-digit',
                    })
                    .replace(' de ', '/') : '';
                const expectedFormatted = expectedDate ? new Date(expectedDate.seconds * 1000)
                    .toLocaleDateString('pt-br', {
                        day: '2-digit',
                        month: '2-digit',
                    })
                    .replace(' de ', '/') : '';

                paymentDoc.push({
                    transactionId: doc.id,
                    cardHolder: cardHolder ? cardHolder : '',
                    cardNumber: cardNumber ? cardNumber : '',
                    charge: chargeFormatted,
                    date: dateFormatted ? dateFormatted : '',
                    expectedDate: expectedFormatted ? expectedFormatted : '',
                    fees: fees ? fees : '',
                    installment: installment ? installment : '',
                    installments: installments ? installments : '',
                    maxInstallments: maxInstallments ? maxInstallments : '',
                    seller: seller ? seller : '',
                    sellerZoopId: sellerZoopId ? sellerZoopId : '',
                    status: status ? status : '',
                    statusColor: matchStatusColor(status)
                });
            });
            setLastDoc(snap.docs[snap.docs.length - 1])
            setPayments([...payments, ...paymentDoc]);
        } catch (error) {
            setErrorLoading(true)
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }
    run();
};

export default fetch;
