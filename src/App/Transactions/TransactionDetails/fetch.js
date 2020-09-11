import currencyFormat from '@ziro/currency-format';
import { dateFormat } from '../utils';
import { db } from '../../../Firebase/index';
import matchStatusColor from '../matchStatusColor';

const fetch = (transactionId, setTransaction, setError, transaction) => {
  const query = db.collection('credit-card-payments').doc(transactionId);

  const run = async () => {
    try {
      await query.onSnapshot(
        async snapshot => {
          const paymentDoc = [];
          if (snapshot.exists) {
            const {
              charge,
              datePaid,
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
              seller,
              cardBrand,
              cardFirstFour,
              cardLastFour,
              cardholder,
              receiptId,
              onBehalfOfBrand,
              collaboratorId,
              collaboratorName,
              observations,
              insurance,
              sellerZoopPlan,
            } = snapshot.data();

            const chargeFormatted = currencyFormat(charge);
            const dateFormatted = datePaid ? dateFormat(datePaid) : '';

            paymentDoc.push({
              transactionZoopId: transactionZoopId ? transactionZoopId : '',
              transactionId: snapshot.id,
              charge: chargeFormatted,
              dateLinkCreated,
              datePaid: dateFormatted,
              fees: fees ? fees : '',
              installments: installments ? installments : '',
              installmentsMax: installmentsMax ? installmentsMax : '',
              seller: seller === 'Ziro' && onBehalfOfBrand ? `${onBehalfOfBrand} - Ziro` : seller,
              sellerZoopId: sellerZoopId ? sellerZoopId : '',
              status: status ? status : '',
              statusColor: matchStatusColor(status),
              buyerRazao,
              receivables: receivables ? receivables : [],
              receivement,
              cardBrand,
              cardFirstFour,
              cardLastFour,
              cardholder,
              receiptId,
              onBehalfOfBrand,
              collaboratorId,
              collaboratorName: collaboratorName || '',
              observations: observations || '',
              insurance: insurance || false,
              sellerZoopPlan: sellerZoopPlan || '',
            });
            if (transaction.status !== paymentDoc[0].status) setTransaction(paymentDoc[0]);
          } else {
            setError(true);
          }
        },
        error => {
          console.log(error);
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  //if (Object.keys(transaction).length === 0 && transaction.constructor === Object) {
  run();
  //}
};

export default fetch;
