import { useFirestore, useFirestoreDocData } from "reactfire"
import { CardType } from "../Componentsv2/ProductGallery"
import { setStateType } from "./types"

const useProduct = (supplierUid: string, productId: string, setState: setStateType, isLoading: boolean) => {
  const query = useFirestore().collection("suppliers").doc(supplierUid).collection("products").doc(productId)
  const { data } = useFirestoreDocData<CardType>(query)
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
}

export default useProduct
