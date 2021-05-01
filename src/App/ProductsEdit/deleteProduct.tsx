import { Dispatch, SetStateAction } from "react"
import { db } from "../../Firebase"

type setIsSubmittingType = Dispatch<SetStateAction<boolean>>

const deleteProduct = async (supplierUid: string, productId: string, setIsSubmitting: setIsSubmittingType) => {
  try {
    setIsSubmitting(true)
    await db.collection("suppliers").doc(supplierUid).collection("products").doc(productId).delete()
  } catch (error) {
    if (error.response) console.log(error.response)
    console.log(error)
    throw error
  } finally {
    setIsSubmitting(false)
  }
}

export default deleteProduct
