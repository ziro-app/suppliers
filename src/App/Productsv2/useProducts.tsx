import { useFirestore, useFirestoreCollectionData } from "reactfire"
import { CardType } from "../Componentsv2/ProductGallery"

type statusType = "loading" | "error" | "success"

type timestamp = {
  seconds: number
  nanoseconds: number
}

export const useProducts = (
  supplierUid: string,
  maxItems: number,
  lastProduct: string | null | timestamp,
): { status: statusType; products: CardType[] } => {
  const query = useFirestore()
    .collection("suppliers")
    .doc(supplierUid)
    .collection("products")
    .orderBy("dateUpdated", "desc")
    .startAfter(lastProduct)
    .limit(maxItems)
  const { status, data } = useFirestoreCollectionData(query)
  const products = (data as unknown) as CardType[]
  return { status, products }
}
