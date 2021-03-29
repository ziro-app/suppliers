import axios from 'axios';
import { db } from '../../Firebase';

const fetch = (setIsLoading, setIsError, setBrands, setBrandsAndTrends) => {
  const source = axios.CancelToken.source();
  const run = async () => {
    const config = {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: process.env.SHEET_CNPJ_ID,
        range: 'Trends!A2:E',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
      cancelToken: source.token,
    };
    try {
      const {
        data: { values },
      } = await axios(config);

      const brands = values.map(([name]) => name);
      const brandsAndTrends = values.map(([name, insta, ...trends]) => [name, trends]);

      const list = [];
      const snapRef = db.collection('catalog-brands');
      const snapCollection = await snapRef.get();
      snapCollection.forEach(document => {
        if (document.data().brand !== '') list.push(document.data().brand);
      });
      setBrands(list.filter((value, index, self) => self.findIndex(m => m === value) === index));
      //setBrands(['TestNewUpload', 'Bot', ...new Set(brands)]);
      setBrandsAndTrends(...new Set(brandsAndTrends));
    } catch (error) {
      if (error.response) console.log(error.response);
      else console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  run();
  return () => source.cancel('Canceled fetch request. Component unmounted');
};

export default fetch;
