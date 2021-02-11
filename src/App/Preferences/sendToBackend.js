import { db, fs } from '../../Firebase/index';

const sendToBackend = state => () => {
  const {
    insuranceValue,
    docId,
    installments,
    setIsError,
    setUnavailableAlwaysInsured,
    setIsSuccess,
    allInstallments
  } = state;

  return new Promise(async (resolve, reject) => {

    let verifiedInstallment = ''

    const checkInstallment = async () => {
      if(allInstallments.includes(installments)){
        return verifiedInstallment = installments
      }else{
        setIsError(true);
        return false
      }
    };

    try {
      setIsError(false);
      if(installments === ''){
        setIsError(true);
        reject("Não pode ser valor vazio.");
      }
      else{
        let placeholderValue = await checkInstallment()
        
        if(placeholderValue === false){
          setIsError(true)
          return reject('Valor inválido. Deve ser entre 1 e 12.')
        }else{

          // Atualiza o campo alwaysInsured no Firebase
          await db.collection('suppliers').doc(docId).update({ alwaysInsured: insuranceValue });

          try {
            // Atualiza o campo maxParcelas no Firebase
            await db.collection('suppliers').doc(docId).update({ maxParcelas: verifiedInstallment })
            
            setIsSuccess(true);
            resolve("Preferências definidas com sucesso.")
            
          } catch (error) {
            console.log('Erro ao atualizar parcelas. Entre em contato com o suporte.', error)
            setIsError(true);
            reject()
          };
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