import consultCnpj from './utils/consultCnpj';
import checkResult from './utils/checkResult';
import mountObject from './utils/mountObject';
import handleError from './utils/handleError';

const searchCnpj = state => () =>
    new Promise(async (resolve, reject) => {
        const { cnpj, suppliers, setCnpjValid, setAlertMessage, validCnaes, cnpjUrl, cnpjToken } = state;
        let config = {
            method: 'POST',
            url: cnpjUrl,
            data: { cnpj },
            headers: {
                'Authorization': cnpjToken
            }
        };
        try {
            if (cnpj.length !== 18) throw { msg: 'Deve ter 14 números', customError: true };
            if (suppliers.includes(cnpj)) throw { msg: 'CNPJ já cadastrado', customError: true };
            const [status, result] = await consultCnpj(config, false);
            const objResult = checkResult(status, result, validCnaes, false);
            mountObject(state, objResult);
            setCnpjValid(true);
            setAlertMessage('');
            resolve('CNPJ válido');
        } catch (error) {
            console.log(error);
            const errorMsg = await handleError(state, error);
            setAlertMessage('');
            if (errorMsg.success) {
                setCnpjValid(true);
                resolve(errorMsg.msg);
            } else {
                setCnpjValid(false);
                reject(errorMsg);
            }
        }
    });

export default searchCnpj