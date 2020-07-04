import { post } from 'axios';
import { db } from '../../Firebase/index';

const mountLink = uid => {
  if (uid) return `https://fabricantes.ziro.app/cadastrar-colaborador?dc=${btoa(uid)}`;
  else return '';
};

const checkEmail = async email => {
  const doc = await db.collection('collaborators').where('email', '==', email).get();
  return doc.empty;
};

const sendToBackend = state => () => {
  const { uid, supplier, fname, lname, email, role, submitCount, brand, setFName, setLName, setEmail, setRole, setSubmitCount, setBrand } = state;
  const nome = fname && lname ? `${fname.trim()} ${lname.trim()}` : '';
  const url = process.env.API_EMAIL;
  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: process.env.EMAIL_TOKEN,
    },
  };
  return new Promise(async (resolve, reject) => {
    try {
      if (uid && email) {
        const isValid = await checkEmail(email);
        if (isValid) {
          const userDb = await db.collection('collaborators').add({
            fname: fname ? fname.trim() : '',
            lname: lname ? lname.trim() : '',
            email,
            status: 'Pendente',
            ownerId: uid,
            role,
            brand,
          });
          const link = mountLink(userDb.id);
          const body = {
            to: email,
            customEmail: false,
            inviteColaborator: {
              name: nome,
              supplier,
              link,
            },
          };
          await post(url, body, config);
          setFName('');
          setLName('');
          setEmail('');
          setRole('');
          setBrand('');
          setSubmitCount(submitCount + 1);
          resolve('Email enviado com sucesso');
        } else throw { msg: 'Email já cadastrado', customError: true };
      } else throw { msg: 'Erro nas informações. Recarregue a página e tente novamente.', customError: true };
    } catch (error) {
      console.log(error);
      if (error.customError) reject(error);
      else if (error.response && error.response.data.error.msg) reject({ msg: 'Ocorreu um erro, contate o suporte.', customError: true });
      else reject(error);
    }
  });
};

export default sendToBackend;
