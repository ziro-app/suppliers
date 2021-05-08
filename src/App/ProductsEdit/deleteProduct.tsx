import { db } from "../../Firebase"

const deleteProduct = async (supplierUid: string, productId: string) => {
  try {
    await db.collection("suppliers").doc(supplierUid).collection("products").doc(productId).delete()
  } catch (error) {
    if (error.response) console.log(error.response)
    console.log(error)
    throw error
  }
}

export default deleteProduct
