import { post } from 'axios';

const mountLink = (uid) => {
    if (uid) return `https://fabricantes.ziro.app/registrar/colaborador?rel=${btoa(uid)}`;
    else return '';
};

const sendToBackend = state => () => {
    const { uid, supplier, name, email, setName, setEmail } = state;
    const nome = name ? name.trim() : '';
    const url = process.env.API_EMAIL;
    const link = mountLink(uid);
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    return new Promise(async (resolve, reject) => {
        try {
            if (uid && email) {
                const body = {
                    to: email,
                    customEmail: false,
                    inviteColaborator: {
                        name: nome,
                        supplier,
                        link
                    }
                }
                await post(url, body, config);
                setName('');
                setEmail('');
                resolve('Email enviado com sucesso')
            } else throw { msg: 'Erro nas informações. Recarregue a página e tente novamente.', customError: true };
        } catch (error) {
            console.log(error);
            if (error.customError) reject(error);
            else if (error.response && error.response.data.error.msg) reject({ msg: error.response.data.error.msg, customError: true });
            else reject(error);
        }
    });

};

export default sendToBackend;
