import { db } from "@bit/ziro.firebase.init"

// Busca o valor do campo backgroundCheckRequestsAvailable
// Somente usar função se for conta de vendedor

const getBackgroundRequestsFree = async ownerId => {
  const request = await db.collection("suppliers").doc(ownerId).get()
  const result = request.data()

  return result.backgroundCheckRequestsAvailable
}

export default getBackgroundRequestsFree
