import { db } from '../../Firebase';

const fetch = (state) => {
  const { cnpj, setIsLoading, setIsError, setNewReason, setNewFantasy, setNewCep, setNewAddress, setNewNeighborhood, setNewCity, setNewCityState } = state;

  const run = async () => {
      const query = db.collection('suppliers').where('cnpj', '==', cnpj)

      try {
          await query.onSnapshot(async snapshot => {
            setIsLoading(true);

            if(!snapshot.empty){
              snapshot.forEach(doc => {
                const { razao, fantasia, cep, endereco, bairro, cidade, estado } = doc.data();
                setNewReason(razao);
                setNewFantasy(fantasia);
                setNewCep(cep);
                setNewAddress(endereco);
                setNewNeighborhood(bairro);
                setNewCity(cidade);
                setNewCityState(estado);
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