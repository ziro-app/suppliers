import { useFirestore, useFirestoreCollectionData } from "reactfire"
import { CardType } from "../Componentsv2/ProductGallery"

type StatusType = "loading" | "error" | "success"

type Timestamp = {
  seconds: number
  nanoseconds: number
}

type ProductsType = CardType[] | []

export const useProducts = (
  supplierUid: string,
  maxItems: number,
  lastProduct: string | null | Timestamp,
): { status: StatusType; products: ProductsType } => {
  const query = useFirestore()
    .collection("suppliers")
    .doc(supplierUid)
    .collection("products")
    .orderBy("dateUpdated", "desc")
    .startAfter(lastProduct)
    .limit(maxItems)
  const { status, data } = useFirestoreCollectionData(query)
  const products = (data as ProductsType) || []
  return { status, products }
}
