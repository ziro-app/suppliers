import currencyFormat from '@ziro/currency-format';
import { dateFormat } from './utils';
import { db } from '../../Firebase/index';
import matchStatusColor from './matchStatusColor';

const fetch = (setIsLoading, setErrorLoading, payments, setPayments, zoopId, limit, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore, docId, isCollaborator) => {
  let query;
  if (isCollaborator) {
    query = db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).where('collaboratorId', '==', docId).orderBy('dateLastUpdate', 'desc').limit(limit);
  } else {
    query = db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).orderBy('dateLastUpdate', 'desc').limit(limit);
  }
  if (lastDoc) query = query.startAfter(lastDoc);

  const run = async () => {
    try {
      await query.onSnapshot(
        async snapshot => {
          let collectionData;
          if (isCollaborator) {
            collectionData = await db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).where('collaboratorId', '==', docId).get();
          } else {
            collectionData = await db.collection('credit-card-payments').where('sellerZoopId', '==', zoopId).get();
          }
          setTotalTransactions(collectionData.docs.length);
          const paymentDoc = [];
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
                receivement,
                receiptId,
                dateLastUpdate,
                sellerZoopPlan,
                insurance,
              } = doc.data();
              const chargeFormatted = currencyFormat(charge);
              const dateFormatted = dateLastUpdate ? dateFormat(dateLastUpdate) : '';
              paymentDoc.push({
                transactionZoopId: transactionZoopId ? transactionZoopId : '',
                transactionId: doc.id,
                charge: chargeFormatted,
                dateLinkCreated,
                date: dateFormatted,
                fees: fees ? fees : '',
                installments: installments ? installments : '',
                installmentsMax: installmentsMax ? installmentsMax : '',
                seller: buyerRazao ? buyerRazao : '-',
                sellerZoopId: sellerZoopId ? sellerZoopId : '',
                status: status ? status : '',
                statusColor: matchStatusColor(status),
                buyerRazao,
                receivables: receivables ? receivables : [],
                receivement,
                receiptId: receiptId ? receiptId : '',
                sellerZoopPlan: sellerZoopPlan || '',
                insurance: insurance || false,
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
        },
        error => {
          console.log(error);
          setIsLoading(false);
          setLoadingMore(false);
        },
      );
    } catch (error) {
      console.log(error);
      setErrorLoading(true);
      setIsLoading(false);
      setLoadingMore(false);
    }
  };
  run();
};

export default fetch;
