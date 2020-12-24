import { post } from 'axios';
import { db } from '../../Firebase/index';
import mountBlocks from './utils/mountBlocks';

const getInfo = async (docId) => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth } = doc.data();
        const now = new Date();
        if (now.getMonth() <= backgroundCheckCurrentMonth) return [backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth];
        else return [10, now.getMonth()];
    } else return [null, null];
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
    const { docId, document, setFreeRequests, clearInfo, setPendency, setPartner } = state;
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
            // BUSCANDO DOCUMENTO NA BASE
            const query = await db.collection('backgroundCheckMock').where(field, '==', document).get();
            if (query.empty) {
                const [freeRequests, currentFreeMonth] = await getInfo(docId);
                if (freeRequests > 0) {
                    const { data: { backgroundCheck } } = await post(url, {}, config);
                    console.log(backgroundCheck);
                    const updated = freeRequests - 1;
                    await db.collection('backgroundCheckMock').add({ date: new Date(), ...backgroundCheck });
                    await db.collection('suppliers').doc(docId).update({
                        backgroundCheckRequestsAvailable: updated,
                        backgroundCheckCurrentMonth: currentFreeMonth
                    });
                    block = mountBlocks(document, backgroundCheck, setPendency, setPartner);
                    scoreValue = backgroundCheck?.score || 0;
                    setFreeRequests(updated);
                    // resolve('Pesquisa na Buy2B');
                } else if (freeRequests === 0) {
                    clearInfo();
                    throw { msg: 'Consultas grátis esgotadas. Recarregue seu saldo', customError: true };
                } else {
                    clearInfo();
                    throw { msg: 'Usuário não encontrado, recarregue a página', customError: true };
                }
            } else {
                const data = query.docs[0].data();
                const { score } = data;
                block = mountBlocks(document, data, setPendency, setPartner);
                scoreValue = score;
                // resolve('Consulta na base própria');
            }
            fillValues(field, scoreValue, block, state);
            resolve();
        } catch (error) {
            clearInfo();
            if (error.customError) reject(error);
            if (error.response) {
                console.log(error.response);
                if (error.response.data.customError) reject(error.response.data);
                else reject({ msg: 'Erro ao buscar documento', customError: true });
            }
            else reject('Erro ao buscar documento');
        }
    });
};

export default sendToBackend;
