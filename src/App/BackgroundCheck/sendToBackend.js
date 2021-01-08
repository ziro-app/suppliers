import { post } from 'axios';
import { db } from '../../Firebase/index';
import mountBlocks from './utils/mountBlocks';

const getInfo = async (docId) => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth, backgroundCheckCurrentYear } = doc.data();
        const now = new Date();
        if (now.getMonth() <= backgroundCheckCurrentMonth && now.getFullYear() <= backgroundCheckCurrentYear) return [backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth, backgroundCheckCurrentYear];
        else return [10, now.getMonth(), now.getFullYear()];
    } else return [null, null, null];
};

const fillValues = (field, scoreValue, block, { setScoreValue, setBlockPF, setBlockPJ }) => {
    if (field === 'cpf') {
        setScoreValue(scoreValue);
        setBlockPF(block);
        setBlockPJ([]);
    } else {
        setBlockPF([]);
        setBlockPJ(block);
    }
};

const sendToBackend = state => () => {
    const { docId, document, setFreeRequests, clearInfo, setPendency, setPartner, setApiError, setDocument } = state;
    const field = document.length === 14 ? 'cpf' : 'cnpj';
    const onlyNumbers = document.replace(/[\D]*/g, '');
    const url = `${process.env.PAY_URL}buy2b-bc?document=${onlyNumbers}`;
    const config = {
        headers: {
            Authorization: `${process.env.PAY_TOKEN}`
        }
    };
    return new Promise(async (resolve, reject) => {
        try {
            let block, scoreValue = 0;
            clearInfo();
            // BUSCANDO DOCUMENTO NA BASE
            const query = await db.collection('backgroundCheck').where(field, '==', document).get();
            if (query.empty) {
                const [freeRequests, currentFreeMonth, currentFreeYear] = await getInfo(docId);
                if (freeRequests > 0) {
                    const { data: { backgroundCheck } } = await post(url, {}, config);
                    console.log(backgroundCheck);
                    const updated = freeRequests - 1;
                    await db.collection('backgroundCheck').add({ date: new Date(), ...backgroundCheck });
                    await db.collection('suppliers').doc(docId).update({
                        backgroundCheckRequestsAvailable: updated,
                        backgroundCheckCurrentYear: currentFreeYear,
                        backgroundCheckCurrentMonth: currentFreeMonth
                    });
                    block = mountBlocks(document, backgroundCheck, setPendency, setPartner);
                    scoreValue = backgroundCheck?.score || 0;
                    setFreeRequests(updated);
                } else if (freeRequests === 0) {
                    setFreeRequests(0);
                    throw { msg: 'Consultas grátis esgotadas. Recarregue seu saldo', customError: true };
                } else throw { msg: 'Usuário não encontrado, recarregue a página', customError: true };
            } else {
                const data = query.docs[0].data();
                const { score } = data;
                block = mountBlocks(document, data, setPendency, setPartner);
                scoreValue = score;
            }
            fillValues(field, scoreValue, block, state);
            resolve();
        } catch (error) {
            if (error.customError) reject(error);
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
            }
            else {
                setDocument('');
                setApiError(true);
            }
        }
    });
};

export default sendToBackend;
