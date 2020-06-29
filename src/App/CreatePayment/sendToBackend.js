import { db } from '../../Firebase/index';

const sendToBackend = state => () => {
    const { seller, sellerId, charge, maxInstallments, isCollaborator, docId, setCharge, setMaxInstallments } = state;
    const baseUrl = 'https://ziro.app/pagamento/';
    return new Promise(async (resolve, reject) => {
        try {
            if (seller && sellerId) {
                let docRef;
                if (isCollaborator) {
                    docRef = await db.collection('credit-card-payments').add({
                        dateLinkCreated: new Date(),
                        seller,
                        sellerZoopId: sellerId,
                        charge,
                        maxInstallments,
                        status: 'Aguardando Pagamento',
                        collaboratorId: docId
                    });
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
                setMaxInstallments('');
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
