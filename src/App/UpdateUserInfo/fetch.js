import { db } from '../../Firebase';

const fetch = (state) => {
  const { cnpj, setIsLoading, setIsError, setNewReason, setNewFantasy, setNewCep, setNewAddress, setNewNeighborhood, setNewCity, setNewCityState, setNewPhone, setNewFName, setNewLName, setNewCpf, setNewBirthdate, setNewWhatsApp } = state;

  const run = async () => {
      const query = db.collection('suppliers').where('cnpj', '==', cnpj)

      try {
          await query.onSnapshot(async snapshot => {
            setIsLoading(true);

            if(!snapshot.empty){
              snapshot.forEach(doc => {
                const {razao, fantasia, cep, endereco, bairro, cidade, estado, telefone, nome, sobrenome, cpf, nascimento, whatsapp } = doc.data();
                setNewReason(razao || '');
                setNewFantasy(fantasia || '');
                setNewCep(cep || '');
                setNewAddress(endereco || '');
                setNewNeighborhood(bairro || '');
                setNewCity(cidade || '');
                setNewCityState(estado || '');
                // setNewPhone(telefone?.split('55 ')[1] || '');
                setNewPhone(telefone && telefone.startsWith('55 ') ? telefone.split('55 ')[1] : telefone || '');
                setNewFName(nome || '');
                setNewLName(sobrenome || '');
                setNewCpf(cpf || '');
                setNewBirthdate(nascimento || '');
                // setNewWhatsApp(whatsapp?.split('55 ')[1] || '');
                setNewWhatsApp(whatsapp && whatsapp.startsWith('55 ') ? whatsapp.split('55 ')[1] : whatsapp || '');
              })
            }
            setIsLoading(false);
          })
          setIsLoading(false);
      } catch (error) {
          console.log(error)
          setIsLoading(false);
          setIsError(true);
      }
  }
  run()
}

export default fetch;