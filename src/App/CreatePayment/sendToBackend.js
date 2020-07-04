import { db } from '../../Firebase/index';

const checkCollaborator = async docId => {
  const collaborator = await db.collection('collaborators').doc(docId).get();
  return collaborator.exists;
};

const sendToBackend = state => () => {
  const { seller, sellerId, charge, maxInstallments, isCollaborator, docId, fname, brand, setCharge, setMaxInstallments } = state;
  const baseUrl = 'https://ziro.app/pagamento/';
  return new Promise(async (resolve, reject) => {
    try {
      if (seller && sellerId) {
        let docRef;
        if (isCollaborator) {
          const isValid = await checkCollaborator(docId);
          if (isValid) {
            docRef = await db.collection('credit-card-payments').add({
              dateLinkCreated: new Date(),
              seller,
              sellerZoopId: sellerId,
              charge,
              maxInstallments,
              status: 'Aguardando Pagamento',
              collaboratorId: docId,
              collaboratorName: fname,
              onBehalfOfBrand: brand,
            });
          } else throw { msg: 'Permissão insuficiente', customError: true };
        } else {
          docRef = await db.collection('credit-card-payments').add({
            dateLinkCreated: new Date(),
            seller,
            sellerZoopId: sellerId,
            charge,
            maxInstallments,
            status: 'Aguardando Pagamento',
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
        if (!brand) setMaxInstallments('');
      } else {
        throw { msg: 'Vendedor não encontrado', customError: true };
      }
    } catch (error) {
      if (error.copyError) {
        resolve('Link criado. Acesse na aba de Vendas');
        setCharge('');
        setMaxInstallments('');
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
