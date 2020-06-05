import consultCnpj from './utils/consultCnpj';
import checkResult from './utils/checkResult';
import mountObject from './utils/mountObject';
import handleError from './utils/handleError';

const lastReq = async (config, validCnaes, state) => {
    let result = {};
    try {
        const [status, result] = await consultCnpj(config);
        const objResult = checkResult(status, result, validCnaes, false);
        mountObject(state, objResult);
        result['error'] = false;
    } catch (error) {
        result['error'] = error;
    } finally {
        return result;
    }
}

const searchCnpj = state => () =>
    new Promise(async (resolve, reject) => {
        const { cnpj, suppliers, setCnpjValid, validCnaes, cnpjUrl, cnpjToken, setStyledLabel, setFirstLabel } = state;
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
            const [status, result] = await consultCnpj(config);
            const objResult = checkResult(status, result, validCnaes, false);
            mountObject(state, objResult);
            setCnpjValid(true);
            setStyledLabel(false);
            setFirstLabel(true);
            resolve('CNPJ válido');
        } catch (error) {
            const errorMsg = await handleError(state, error);
            setStyledLabel(false);
            setFirstLabel(true);
            if (errorMsg.tryAgain) {
                setStyledLabel(true);
                setFirstLabel(false);
                await setTimeout(async () => {
                    config['data']['ignore_db'] = false;
                    let result = await lastReq(config, validCnaes, state);
                    setStyledLabel(false);
                    setFirstLabel(true);
                    if (result.error) {
                        setCnpjValid(false);
                        reject({ msg: result.error.msg, customError: true });
                    }
                    else {
                        setCnpjValid(true);
                        resolve('CNPJ válido');
                    }
                }, 30000);
            }
            else if (errorMsg.success) {
                setCnpjValid(true);
                resolve(errorMsg.msg);
            } else {
                setCnpjValid(false);
                reject(errorMsg);
            }
        }
    });

export default searchCnpj