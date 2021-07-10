import { UpdateFirebaseDoc } from "../types"

export async function updateDoc(data: UpdateFirebaseDoc) {
  const { collectionData, collectionRef, field, identifier } = data
  if (field === "uid") {
    await collectionRef.doc(identifier).update({ ...collectionData })
  } else {
    const doc = await collectionRef.where(field, "==", identifier).get()
    const docRef = doc.docs[0].ref
    await docRef.update({ ...collectionData })
  }
}
