import { fs, db } from '../../../../Firebase'
import { calculateNewQuantities } from './functionsProductsCart'

const { arrayRemove, arrayUnion, delete: exclude, serverTimestamp } = fs.FieldValue

export const updateProductStock = (productSnapshot, newRequestedQuantities) => async transaction => {
    const { availableQuantities } = productSnapshot.data()

    if (!availableQuantities) return

    const [totalAvailable, newAvailable, newRequested] = calculateNewQuantities(newRequestedQuantities, availableQuantities)

    const productData = { availableQuantities: newAvailable, status: totalAvailable < 1 ? 'soldOut' : 'available' }
    const cartItemData = {
      products: { [productSnapshot.id]: { requestedQuantities: newRequested } },
      lastUpdate: serverTimestamp(),
      updatedBy: 'storeowner',
    }

    transaction.set(productSnapshot.ref, productData, { merge: true })
    //transaction.set(cartItemSnapshot.ref, cartItemData, { merge: true })
  },
  cartItemProductSubtracter = buyerStoreownerId => (productSnapshot, cartItemSnapshot) => async transaction => {
    const { productIds } = cartItemSnapshot.data()

    if (!productIds.includes(productSnapshot.id)) throw 'PRODUCT_NOT_IN_CART'

    await updateProductStock(productSnapshot, cartItemSnapshot)(transaction)

    const productData = { addedToCart: arrayRemove(buyerStoreownerId) }
    transaction.set(productSnapshot.ref, productData, { merge: true })

    const cartItemData = {
      productIds: arrayRemove(productSnapshot.id),
      products: { [productSnapshot.id]: exclude() },
    }
    transaction.set(cartItemSnapshot.ref, cartItemData, { merge: true })
  },
  cartItemProductAdder = buyerStoreownerId => (productRef, cartItemRef) => async transaction => {
    const productData = {
      favorited: arrayRemove(buyerStoreownerId),
      addedToCart: arrayUnion(buyerStoreownerId),
    }

    const cartItemData = {
      productIds: arrayUnion(productRef.id),
      products: { [productRef.id]: { added: serverTimestamp() } },
      lastUpdate: serverTimestamp(),
      updatedBy: 'buyerStoreowner',
    }

    transaction.set(productRef, productData, { merge: true })
    transaction.set(cartItemRef, cartItemData, { merge: true })
  }
