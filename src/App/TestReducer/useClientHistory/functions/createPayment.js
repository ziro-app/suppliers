import {db, fs} from '../../../../Firebase'
import checkCollaborator from './utils/checkCollaborator'

const createPayment = async (state, action) => {
    const { seller, sellerId, charge, maxInstallments, isCollaborator, docId, fname, brand, setCharge, setMaxInstallments, observations, setObservations } = action.payload.state;
    const {resolve, reject} = action.payload.promise
    const baseUrl = 'https://ziro.app/pagamento/';
        try {
          const nowDate = fs.FieldValue.serverTimestamp()
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
}

export default createPayment