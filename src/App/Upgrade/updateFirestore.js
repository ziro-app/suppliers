import { db } from '../../Firebase/index';

const updateFirestore = async (docId, categoryName, bankName, bankNumber, tipoConta, reason, accountNumber, agency, cpf, nascimento) => {
  const update = async () => {
    let sellerZoopPlan = {};
    const fetchedStandardPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN);
    const doc = await fetchedStandardPlan.get();
    sellerZoopPlan = doc.data().main.standardPlans;
    sellerZoopPlan.activePlan = 'standard';
    await db
      .collection('suppliers')
      .doc(docId)
      .update({
        cpf,
        categoria: categoryName,
        nomeBanco: bankName.includes(' - ') ? bankName.split(' - ')[1] : bankName,
        codBanco: bankNumber,
        tipoConta: tipoConta,
        titular: reason,
        nascimento: nascimento,
        numConta: accountNumber,
        agencia: agency,
        tipoCadastro: 'Completo',
        sellerZoopPlan,
        maxParcelas: '10',
      });
  };

  await update();
};

export default updateFirestore;
