import { db } from '../../../Firebase/index';

const getDocInfo = async transactionZoopId => {
    const docsCollection = await db.collection('credit-card-payments').where('transactionZoopId', '==', transactionZoopId).get();
    if (docsCollection.empty) {
        console.log(`Fora do Firebase - ${transactionZoopId}`);
        return false;
    } else return { ...docsCollection.docs[0].data(), docRef: docsCollection.docs[0].id };
};

export default getDocInfo;
