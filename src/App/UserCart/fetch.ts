import { db } from '../../Firebase';
const fetch = async state => {
  const { last7Days, setAllCarts, setAllStoreowners } = state;
  const queryStoreowners = db.collection('storeowners');
  const queryCart = db.collectionGroup('cart').where('lastUpdate', '>=', last7Days).orderBy('lastUpdate', 'desc');

  queryCart.onSnapshot(async snapshot => {
    const carts = [];
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        console.log('carts:',doc.data())
        carts.push(doc);
      });
      setAllCarts(carts);
    }
  });
  queryStoreowners.get().then(docs => {
    const storeowners = [];
    if (!docs.empty) {
      docs.forEach(doc => {
        //console.log('storeowners:',doc.data())
        storeowners.push(doc);
      });
      setAllStoreowners(storeowners);
    }
  });
};

export default fetch;
