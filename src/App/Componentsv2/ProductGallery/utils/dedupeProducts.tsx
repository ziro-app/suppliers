import { CardType } from "@bit/ziro.utils.types"

/** this function prevents the addition of products with the same firebase id */
export const dedupeProducts = (prevProducts: CardType[], products: CardType[]) => {
  const deduped: CardType[] = []
  const prevIds = prevProducts.map(prevProduct => prevProduct.id)
  products.forEach(product => {
    if (!prevIds.includes(product.id)) deduped.push(product)
  })
  return deduped
}
