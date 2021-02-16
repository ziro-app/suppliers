import { db, fs } from '../../Firebase/index';
import linkMessage from './utils/linkMessage';
import currencyFormat from '@ziro/currency-format';

const checkCollaborator = async docId => {
  const collaborator = await db.collection('collaborators').doc(docId).get();
  return collaborator.exists;
};

const sendToBackend = state => () => {
  const {
    seller,
    sellerId,
    charge,
    installmentsMax,
    isCollaborator,
    docId,
    fname,
    brand,
    setCharge,
    setInstallmentsMax,
    observations,
    setObservations,
    insurance,
    setInsurance,
    setInsurenceDropdownValue,
    hasSellerZoopPlan,
    checkoutWithoutRegister,
    setCheckoutWithoutRegister,
    setAfterBackend,
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
            let sellerZoopPlan = null;
            if (hasSellerZoopPlan) {
              const fetchedStandardPlan = await db.collection('suppliers').where('fantasia', '==', seller.toUpperCase()).get();
              fetchedStandardPlan.forEach(supplier => (sellerZoopPlan = supplier.data().sellerZoopPlan));
            }
            docRef = await db.collection('credit-card-payments').add({
              dateLinkCreated: nowDate,
              dateLastUpdate: nowDate,
              seller,
              sellerZoopId: sellerId,
              charge,
              installmentsMax: `${parseInt(installmentsMax)}`,
              status: 'Aguardando Pagamento',
              collaboratorId: docId,
              collaboratorName: fname,
              //onBehalfOfBrand: brand ? brand : seller,
              observations,
              insurance: insurance !== null ? insurance : true,
              sellerZoopPlan: sellerZoopPlan || null,
              checkoutWithoutRegister: checkoutWithoutRegister || false,
            });
          } else throw { msg: 'Permissão insuficiente', customError: true };
        } else {
          let sellerZoopPlan = null;
          if (hasSellerZoopPlan) {
            const fetchedStandardPlan = await db.collection('suppliers').where('fantasia', '==', seller.toUpperCase()).get();
            fetchedStandardPlan.forEach(supplier => (sellerZoopPlan = supplier.data().sellerZoopPlan));
          }
          docRef = await db.collection('credit-card-payments').add({
            dateLinkCreated: nowDate,
            dateLastUpdate: nowDate,
            seller,
            sellerZoopId: sellerId,
            charge,
            installmentsMax: `${parseInt(installmentsMax)}`,
            status: 'Aguardando Pagamento',
            observations,
            insurance: insurance !== null ? insurance : true,
            sellerZoopPlan: sellerZoopPlan || null,
            checkoutWithoutRegister: checkoutWithoutRegister || false,
          });
        }
        try {
          const doc = await docRef.get();
          const formattedCharge = currencyFormat(charge);
          if (doc) await navigator.clipboard.writeText(linkMessage(baseUrl, doc.id, seller, formattedCharge, installmentsMax));
        } catch (error) {
          throw { msg: 'Erro ao realizar a cópia', copyError: true };
        }
        resolve('Link copiado. Só usar CTRL+V');
        setCharge('');
        setInstallmentsMax('');
        setObservations('');
        setInsurance(null);
        setInsurenceDropdownValue('');
        setCheckoutWithoutRegister(false);
        setAfterBackend(true);
      } else {
        throw { msg: 'Vendedor não encontrado', customError: true };
      }
    } catch (error) {
      if (error.copyError) {
        resolve('Link criado. Acesse na aba de Vendas');
        setCharge('');
        setInstallmentsMax('');
        setInsurance(null);
        setInsurenceDropdownValue('');
        setCheckoutWithoutRegister(false);
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
