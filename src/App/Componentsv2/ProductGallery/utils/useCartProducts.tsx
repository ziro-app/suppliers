import { useFirestore, useFirestoreCollectionData } from "reactfire"
import { CartProduct } from "@bit/ziro.utils.types"

export const useCartProducts = (retailerUid: string, orderId: string) => {
  const docRef = useFirestore()
    .collection("retailers")
    .doc(retailerUid)
    .collection("orders")
    .doc(orderId)
    .collection("products")
  const { status, data } = useFirestoreCollectionData(docRef)
  const cartProducts = (data as CartProduct[]) || []
  return { status, cartProducts }
}
