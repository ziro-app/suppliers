import axios from 'axios';
import { db } from '../../../Firebase/index';
import createTransaction from './utils/createTransaction';
import prepareDataToPay from './utils/prepareDataToPay';

const getInfo = async docId => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailablePaid } = doc.data();
        return backgroundCheckRequestsAvailablePaid;
    } else return null;
};

const sendToBackend = state => () => {
    console.log('entrou');
    const { docId, quantity, setApiError, totalValueCreditBackgroundCheck } = state;
    return new Promise(async resolve => {
        try {
            const paymentData = prepareDataToPay(state, process.env.SELLER_ID_ZIRO, totalValueCreditBackgroundCheck, 'Ziro');
            const transaction = await createTransaction(paymentData);
            console.log(transaction);
            const backgroundCheckRequestsAvailablePaid = await getInfo(docId);
            if (typeof backgroundCheckRequestsAvailablePaid !== 'undefined') {
                const sum = Number(backgroundCheckRequestsAvailablePaid) + Number(quantity);
                await db.collection('suppliers').doc(docId).update({
                    backgroundCheckRequestsAvailablePaid: sum,
                });
            }
            resolve('resolved');
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                if (error.response.data.customError) {
                    console.log(error.response.data.error);
                    resolve(null);
                } else {
                    // Caso ocorra algum erro não previsto na API
                    setApiError(true);
                }
            } else resolve(null);
        }
    });
};

export default sendToBackend;
