import { db, fs } from '../../Firebase/index';

const sendToBackend = state => () => {
  const {
    insuranceValue,
    docId,
    installments,
    setIsError,
    setUnavailableAlwaysInsured,
    setIsSuccess
  } = state;

  return new Promise(async (resolve, reject) => {
    try {
      setIsError(false);
      if(installments === ''){
        setIsError(true);
        reject();
      }
      else{

        // Atualiza o campo alwaysInsured no Firebase
        await db.collection('suppliers').doc(docId).update({ alwaysInsured: insuranceValue });

        try {
          // Atualiza o campo maxParcelas no Firebase
          await db.collection('suppliers').doc(docId).update({ maxParcelas: installments })
          
          setIsSuccess(true);
          resolve("Preferências definidas com sucesso.")
          
        } catch (error) {
          console.log('Erro ao atualizar parcelas. Entre em contato com o suporte.', error)
          setIsError(true);
          reject()
        };
      };
    
    } catch (error) {
      console.log('Erro ao atualizar seguro. Entre em contato com o suporte.', error);
      setUnavailableAlwaysInsured(true);
      reject()
    };
  });
};

export default sendToBackend;