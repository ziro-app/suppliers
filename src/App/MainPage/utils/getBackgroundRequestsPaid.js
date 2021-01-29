import { db } from '../../../Firebase/index';

// Busca o valor do campo backgroundCheckRequestsAvailablePaid
// Somente usar função se for conta de vendedor

const getBackgroundRequestsPaid = async ownerId => {
  const request = await db.collection('suppliers').doc(ownerId).get();
  const result = request.data();

  return result.backgroundCheckRequestsAvailablePaid
};

export default getBackgroundRequestsPaid;