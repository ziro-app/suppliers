import consultCnpj from './utils/consultCnpj';
import checkResult from './utils/checkResult';
import updateReceita from './utils/updateReceita';

const lastReq = async (config, cnpj, setErrorMsg, setStoreowner, zoopId) => {
    let result = {};
    try {
        const [status, result] = await consultCnpj(config)
        const objResult = checkResult(status, result, false)
        updateReceita(cnpj, objResult, setErrorMsg, setStoreowner, zoopId)
        result['ok'] = true
        result['error'] = false
        return result
    } catch (error) {
        result['error'] = error;
        return result
    }
}
const searchCnpj = (state,setStoreowner, zoopId) => () =>
    new Promise(async (resolve, reject) => {
        const { cnpj, setFirstLabel, setIsOpen, setErrorMsg } = state;
        let config = {
            method: 'POST',
            url: process.env.CNPJ_URL,
            data: { cnpj, "ignore_db": true },
            headers: {
                'Authorization': process.env.CNPJ_TOKEN
            }
        }
        try {
            setIsOpen(true);
            if (cnpj.length !== 18){
                setErrorMsg('CNPJ Deve ter 14 números')
                throw { msg: 'Deve ter 14 números', customError: true }
            }
            const [status, result] = await consultCnpj(config)
            const objResult = checkResult(status, result, false);
            console.log('HERE')
            updateReceita(cnpj, objResult, setErrorMsg, setStoreowner, zoopId)
            setIsOpen(false);
            setFirstLabel(true);
            resolve('CNPJ válido');
        } catch (error) {
            if(error.tryAgain){
                setFirstLabel(false);
                await setTimeout(async () => {
                    config['data']['ignore_db'] = false;
                    let resultado = await lastReq(config, cnpj, setErrorMsg, setStoreowner, zoopId);
                    setIsOpen(false);
                    setFirstLabel(true);
                    if (resultado.error) {
                        setErrorMsg(resultado.error.msg)
                        reject({ msg: resultado.error.msg, customError: true });
                    }
                    else if (resultado.ok) {
                        resolve('CNPJ válido');
                    }
                    else {
                        setErrorMsg('Ocorreu um erro, tente novamente')
                        reject({ msg: 'Ocorreu um erro, tente novamente', customError: true });
                    }
                }, 30000);
            } else {
                setIsOpen(false);
                setFirstLabel(true);
                setErrorMsg(error.msg || 'Ocorreu um error, favor tentar novamente ou entrar em contato com o responsável.')
                reject(error);
            }
        }
    });

export default searchCnpj