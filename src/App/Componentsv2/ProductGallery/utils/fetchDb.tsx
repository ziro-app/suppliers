import { db } from "@bit/ziro.firebase.init"
import { CardType, Timestamp } from "@bit/ziro.utils.types"

/** startAfter clause does not work on first fetch (and it's not supposed to) */
/** @see https://github.com/firebase/firebase-js-sdk/issues/1235 */

export const fetchDb = async (supplierUid: string, maxItems: number, lastProduct?: Timestamp) => {
  let query
  if (lastProduct) {
    /** if lastProduct exists, then query should be a pagination query */
    query = db
      .collection("suppliers")
      .doc(supplierUid)
      .collection("products")
      .orderBy("dateUpdated", "desc")
      .startAfter(lastProduct)
      .limit(maxItems)
  } else {
    /** else query should be a 'first' query, without the startAfter clause */
    query = db
      .collection("suppliers")
      .doc(supplierUid)
      .collection("products")
      .orderBy("dateUpdated", "desc")
      .limit(maxItems)
  }
  const querySnapshot = await query.get()
  const data: CardType[] = []
  querySnapshot.forEach(doc => {
    const docData = { ...doc.data(), id: doc.id }
    data.push(docData as CardType)
  })
  return data
}
