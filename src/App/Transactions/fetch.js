import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setPayments, docId) => {
    const run = async () => {
        db.collection('suppliers')
            .doc(docId)
            .collection('payments')
            .onSnapshot(
                snapshot => {
                    if (!snapshot.empty) {
                        const paymentDoc = [];
                        snapshot.forEach(doc => {
                            const { cardHolder, cardNumber, charge, date, expectedDate, fees, installment,
                                installments, maxInstallments, seller, sellerZoopId, status } = doc.data();
                            const chargeFormatted = currencyFormat(charge);
                            const dateFormatted = new Date(date.seconds * 1000)
                                .toLocaleDateString('pt-br', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                                .replace(' de ', '/');
                            const expectedFormatted = new Date(expectedDate.seconds * 1000)
                                .toLocaleDateString('pt-br', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                                .replace(' de ', '/');
                            paymentDoc.push({
                                cardHolder,
                                cardNumber,
                                charge: chargeFormatted,
                                date: dateFormatted,
                                expectedDate: expectedFormatted,
                                fees: fees ? fees : '',
                                installment,
                                installments,
                                maxInstallments,
                                seller,
                                sellerZoopId,
                                status
                            });
                        });
                        setPayments(paymentDoc);
                    }
                    setIsLoading(false);
                },
                error => {
                    console.log(error);
                    setErrorLoading(true);
                    setIsLoading(false);
                }
            );
    };
    run();
};

export default fetch;
