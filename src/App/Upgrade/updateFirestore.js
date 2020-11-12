import { db } from '../../Firebase/index';

const updateFirestore = async (docId, categoryName, bankName, bankNumber, tipoConta, reason, accountNumber, agency) => {
  
  const update = async () => {
    await db.collection('suppliers').doc(docId).update({
      categoria: categoryName,
      nomeBanco: bankName.includes(' - ') ? bankName.split(' - ')[1] : bankName,
      codBanco: bankNumber,
      tipoConta: tipoConta,
      titular: reason,
      numConta: accountNumber,
      agencia: agency,
      tipoCadastro: 'Completo',
      sellerZoopPlan: {
        markup: {
          amount: 0,
          percentage: 0
        },
        antiFraud: {
          amount: 0,
          percentage: 0
        }
      },
      maxParcelas: '10'
    });
  };

  await update();
};

export default updateFirestore;