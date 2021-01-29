import { db } from '../../../Firebase/index';

// Busca o valor do campo backgroundCheckRequestsAvailable
// Somente usar função se for conta de vendedor

const getBackgroundRequestsFree = async ownerId => {
  const request = await db.collection('suppliers').doc(ownerId).get();
  const result = request.data();

  console.log('result.backgroundCheckRequestsAvailable', result.backgroundCheckRequestsAvailable);
  
  return result.backgroundCheckRequestsAvailable
};

export default getBackgroundRequestsFree;