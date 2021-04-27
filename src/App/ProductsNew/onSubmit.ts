import { fs, db, storage } from "../../Firebase/index"

const onSubmit = async state => {
  const { description, price, discount, reference, colors, sizes, uid } = state
  const now = fs.FieldValue.serverTimestamp()
  try {
    const docRef = await db.collection("suppliers").doc(uid).collection("products").add({
      dateCreated: now,
      dateUpdated: now,
      information: {
        description,
        discount,
        //   images,
        price,
        reference,
      },
      variations: {
        colors,
        sizes,
      },
    })
    console.log(docRef)
  } catch (error) {
    console.log(error)
    if (error.response) console.log(error.response)
    throw new Error(error)
  }
}

export default onSubmit
