import { db, fs } from '../../Firebase/index';

const checkCollaborator = async docId => {
  const collaborator = await db.collection('collaborators').doc(docId).get();
  return collaborator.exists;
};

const sendToBackend = state => () => {
  const {
    seller,
    sellerId,
    charge,
    maxInstallments,
    isCollaborator,
    docId,
    fname,
    brand,
    setCharge,
    setMaxInstallments,
    observations,
    setObservations,
    insurance,
    setInsurance,
    setInsurenceDropdownValue,
    hasSplitPaymentPlan,
  } = state;
  const baseUrl = process.env.HOMOLOG ? 'http://localhost:8080/pagamento/' : 'https://ziro.app/pagamento/';
  return new Promise(async (resolve, reject) => {
    try {
      const nowDate = fs.FieldValue.serverTimestamp();
      if (seller && sellerId) {
        let docRef;
        if (isCollaborator) {
          const isValid = await checkCollaborator(docId);
          if (isValid) {
            docRef = await db.collection('credit-card-payments').add({
              dateLinkCreated: nowDate,
              dateLastUpdate: nowDate,
              seller,
              sellerZoopId: sellerId,
              charge,
              maxInstallments,
              status: 'Aguardando Pagamento',
              collaboratorId: docId,
              collaboratorName: fname,
              onBehalfOfBrand: brand ? brand : seller,
              observations,
              insurance: insurance !== null ? insurance : true,
              splitPaymentPlan: hasSplitPaymentPlan || null,
            });
          } else throw { msg: 'Permissão insuficiente', customError: true };
        } else {
          docRef = await db.collection('credit-card-payments').add({
            dateLinkCreated: nowDate,
            dateLastUpdate: nowDate,
            seller,
            sellerZoopId: sellerId,
            charge,
            maxInstallments,
            status: 'Aguardando Pagamento',
            observations,
            insurance: insurance !== null ? insurance : true,
            splitPaymentPlan: hasSplitPaymentPlan || null,
          });
        }
        try {
          const doc = await docRef.get();
          if (doc) await navigator.clipboard.writeText(`${baseUrl}${doc.id}/escolher-cartao?doc`);
        } catch (error) {
          throw { msg: 'Erro ao realizar a cópia', copyError: true };
        }
        resolve('Link copiado');
        setCharge('');
        setMaxInstallments('');
        setObservations('');
        setInsurance(null);
        setInsurenceDropdownValue('');
      } else {
        throw { msg: 'Vendedor não encontrado', customError: true };
      }
    } catch (error) {
      if (error.copyError) {
        resolve('Link criado. Acesse na aba de Vendas');
        setCharge('');
        setMaxInstallments('');
        setInsurance(null);
        setInsurenceDropdownValue('');
      }
      if (error.customError) reject(error);
      else {
        console.log(error);
        if (error.response) console.log(error.response);
        reject('Erro ao criar cobrança');
      }
    }
  });
};

export default sendToBackend;
