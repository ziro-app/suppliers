import { db } from "@bit/ziro.firebase.init"

const getDoc = async docId => {
  const doc = await db.collection("credit-card-payments").doc(docId).get()
  return doc.exists ? doc : null
}

export default getDoc
