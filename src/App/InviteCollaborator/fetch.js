import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setCatalogBrands, { setEmails }) => {
  const emails = [];
  const run = async () => {
    try {
      let list = [];
      const snapRef = db.collection('catalog-brands');
      const snapCollection = await snapRef.get();
      snapCollection.forEach(document => {
        if (document.data().brand !== '') list.push(document.data().brand);
      });
      setCatalogBrands(list);
      const collaborators = await db.collection('collaborators').get();
      if (!collaborators.empty) {
        collaborators.forEach(doc => {
          const { email } = doc.data();
          if (email !== '') emails.push(email);
        });
        setEmails(emails);
        setIsLoading(false);
      } else {
        setEmails([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorLoading(true);
      setIsLoading(false);
    }
  };
  run();
};

export default fetch;
