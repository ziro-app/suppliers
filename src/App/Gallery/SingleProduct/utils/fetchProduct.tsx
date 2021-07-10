import { db } from "@bit/ziro.firebase.init"
import { CardType } from "@bit/ziro.utils.types"
import { setStateType } from "../types"

const fetchProduct = async (
  supplierUid: string,
  productId: string,
  setState: setStateType,
  isLoading: boolean,
  shouldFetch: boolean,
  mounted: boolean,
) => {
  if (isLoading || shouldFetch) {
    const data = await db.collection("suppliers").doc(supplierUid).collection("products").doc(productId).get()
    if (!data.exists) throw new Error("Produto não encontrado")
    const product = data.data() as CardType
    const { setShouldFetch, setIsLoading, setFetchedImages } = setState
    const { setTitle, setDescription, setPrice, setDiscount, setReference, setColors, setSizes } = setState
    const { information, variations } = product
    const { images, title, description, price, discount, reference } = information
    const { colors, sizes } = variations
    if (mounted) {
      setShouldFetch(false)
      setIsLoading(false)
      setFetchedImages(images)
      setTitle(title)
      setDescription(description)
      setPrice(price)
      setDiscount(discount)
      setReference(reference)
      setColors(colors)
      setSizes(sizes)
    }
  }
}

export default fetchProduct
