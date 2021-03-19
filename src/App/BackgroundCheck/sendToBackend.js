import { db } from '../../Firebase/index';
import mountBlocks from './utils/mountBlocks';
import { post } from 'axios';

const getInfo = async docId => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailable, backgroundCheckRequestsAvailablePaid, backgroundCheckCurrentMonth, backgroundCheckCurrentYear } = doc.data();
        return [backgroundCheckRequestsAvailablePaid, backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth, backgroundCheckCurrentYear];
        // Code for automatic credit renewal
        // const now = new Date();
        // if (now.getMonth() <= backgroundCheckCurrentMonth && now.getFullYear() <= backgroundCheckCurrentYear)
        //     return [backgroundCheckRequestsAvailablePaid, backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth, backgroundCheckCurrentYear];
        // else return [backgroundCheckRequestsAvailablePaid, 10, now.getMonth(), now.getFullYear()];
    } else return [null, null, null, null];
};

const fillValues = (field, scoreValue, block, { setScoreValue, setBlockPF, setBlockPJ }) => {
    if (!block || block === undefined) return;
    else if (field === 'cpf') {
        setScoreValue(scoreValue);
        setBlockPF(block);
        setBlockPJ([]);
    } else {
        setBlockPF([]);
        setBlockPJ(block);
    }
};

const sendToBackend = state => () => {
    const { docId, isCollaborator, ownerId, document, setFreeRequests, setPaidRequests, clearInfo, setPendency, setApiError, setDocument, setDefaultData } = state;
    const field = document.length === 14 ? 'cpf' : 'cnpj';
    const onlyNumbers = document.replace(/[\D]*/g, '');
    const url = `${process.env.PAY_URL}buy2b-bc?document=${onlyNumbers}`;
    const refId = isCollaborator ? ownerId : docId;
    const config = {
        headers: {
            Authorization: `${process.env.PAY_TOKEN}`,
        },
    };
    return new Promise(async (resolve, reject) => {
        try {
            let block,
                scoreValue = 0;
            clearInfo();
            // BUSCANDO DOCUMENTO NA BASE
            const query = await db.collection('backgroundCheck').where(field, '==', document).get();
            if (query.empty) {
                const [paidRequests, freeRequests, currentFreeMonth, currentFreeYear] = await getInfo(refId);
                if (freeRequests > 0 || paidRequests > 0) {
                    const { data } = await post(url, {}, config);
                    console.log(data);
                    const { backgroundCheck } = data;
                    console.log(backgroundCheck);
                    if (backgroundCheck) {
                        let updated = 0;
                        if (freeRequests > 0) {
                            updated = freeRequests - 1;
                            await db.collection('backgroundCheck').add({ date: new Date(), ...backgroundCheck });
                            await db.collection('suppliers').doc(refId).update({
                                backgroundCheckRequestsAvailable: updated,
                                backgroundCheckCurrentYear: currentFreeYear,
                                backgroundCheckCurrentMonth: currentFreeMonth,
                            });
                            setFreeRequests(updated);
                        } else if (paidRequests > 0) {
                            updated = paidRequests - 1;
                            await db.collection('backgroundCheck').add({ date: new Date(), ...backgroundCheck });
                            await db.collection('suppliers').doc(refId).update({
                                backgroundCheckRequestsAvailablePaid: updated,
                                backgroundCheckCurrentYear: currentFreeYear,
                                backgroundCheckCurrentMonth: currentFreeMonth,
                            });
                            setPaidRequests(updated);
                        }
                        console.log('backgroundCheck inside sendToBackend', backgroundCheck);
                        block = mountBlocks(document, backgroundCheck, { setPendency, setDefaultData });
                        scoreValue = backgroundCheck?.score || 0;
                    } else {
                        setDocument('');
                        setApiError(true);
                    }
                } else if (freeRequests === 0 && paidRequests === 0) {
                    setFreeRequests(0);
                    setPaidRequests(0);
                    throw { msg: 'Consultas esgotadas. Recarregue seu saldo', customError: true };
                } else throw { msg: 'Usuário não encontrado, recarregue a página', customError: true };
            } else {
                const data = query.docs[0].data();
                const { score } = data;
                console.log('data inside sendToBackend', data);
                block = mountBlocks(document, data, { setPendency, setDefaultData });
                scoreValue = score;
            }
            fillValues(field, scoreValue, block, state);
            resolve();
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                if (error.response.data.customError) {
                    console.log(error.response.data.error);
                    reject(error.response.data);
                } else {
                    // Caso ocorra algum erro não previsto na API
                    setDocument('');
                    setApiError(true);
                }
            } else reject(error);
        }
    });
};

export default sendToBackend;
