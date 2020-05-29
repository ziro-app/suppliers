import consultCnpj from './consultCnpj';
import checkResult from './checkResult';
import mountObject from './mountObject';

const handleError = async ({ cnpj, setReason, setFantasia, setAlertMessage, validCnaes, cnpjUrl, cnpjToken }, error) => {
    if (error.customError) return error;
    else if (error.tryAgain) {
        let config = {
            method: 'POST',
            url: cnpjUrl,
            data: {
                cnpj,
                ignore_db: true
            },
            headers: {
                'Authorization': cnpjToken
            }
        };
        try {
            setReason('');
            setFantasia('');
            setAlertMessage('Aguarde. Pode levar alguns minutos. Não saia da página');
            const [status, result] = await consultCnpj(config);
            const objResult = checkResult(status, result, validCnaes, true);
            mountObject(state, objResult);
            return { msg: 'CNPJ válido', success: true };
        } catch (error) {
            try {
                if (error.customError) return error;
                else if (error.finally) return { msg: error.msg, customError: true };
                else if (error.tryAgain) {
                    setAlertMessage('A validação é demorada, aguarde sem sair da página');
                    config['data']['ignore_db'] = false;
                    const [status, result] = await consultCnpj(config);
                    const objResult = checkResult(status, result, validCnaes, false);
                    mountObject(state, objResult);
                    return { msg: 'CNPJ válido', success: true };
                }
                else return { msg: 'Erro na validação, tente novamente.', customError: true };
            } catch (error) {
                if (error.msg) return { msg: error.msg, customError: true };
                else return { msg: 'Erro na validação, tente novamente.', customError: true };
            }
        }
    }
    else return { msg: 'Erro na validação, tente novamente.', customError: true };
};

export default handleError