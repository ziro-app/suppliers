import currencyFormat from '@ziro/currency-format';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setPayments, zoopId = '13c09ab817014ae6843634493177afb2') => {
    const run = async () => {
        db.collection('credit-card-payments')
            .where('sellerZoopId', '==', zoopId)
            .orderBy('date', 'desc')
            .onSnapshot(
                snapshot => {
                    if (!snapshot.empty) {
                        const paymentDoc = [];
                        snapshot.forEach(doc => {
                            const { seller, charge, status, date } = doc.data();
                            const chargeFormatted = currencyFormat(charge);
                            const dateFormatted = new Date(date.seconds * 1000)
                                .toLocaleDateString('pt-br', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                                .replace(' de ', '/');
                            paymentDoc.push({
                                seller,
                                charge: chargeFormatted,
                                status,
                                date: dateFormatted,
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
