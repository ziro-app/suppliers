import axios from 'axios';

const consultCnpj = async (config, ignoreDb) => {
    if (ignoreDb) {
        throw { tryAgain: true };
    } else {
        try {
            const { data: { status, result } } = await axios(config);
            return [status, result];
        } catch (error) {
            throw { msg: 'Erro ao realizar consulta', tryAgain: true };
        }
    }
};

export default consultCnpj;