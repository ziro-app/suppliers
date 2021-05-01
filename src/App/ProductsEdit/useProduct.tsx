import { useFirestore, useFirestoreDocDataOnce } from "reactfire"
import { CardType } from "../Componentsv2/ProductGallery"
import { setStateType } from "./types"

export const useProduct = (supplierUid: string, productId: string, setState: setStateType, isLoading: boolean) => {
  const query = useFirestore().collection("suppliers").doc(supplierUid).collection("products").doc(productId)
  const { status, data } = useFirestoreDocDataOnce<CardType>(query)
  console.log(data)
  if (data && isLoading) {
    const {
      setIsLoading,
      setFetchedImages,
      setDescription,
      setPrice,
      setDiscount,
      setReference,
      setColors,
      setSizes,
    } = setState
    const { information, variations } = data
    const { images, description, price, discount, reference } = information
    const { colors, sizes } = variations
    setIsLoading(false)
    setFetchedImages(images)
    setDescription(description)
    setPrice(price)
    setDiscount(discount)
    setReference(reference)
    setColors(colors)
    setSizes(sizes)
  }
  return { status }
}
