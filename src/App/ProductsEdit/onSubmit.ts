import { fs, db, storage } from "../../Firebase/index"
import validateImages from "./validateImages"
import { stateType, setStateType } from "./types"

const onSubmit = async (state: stateType, setState: setStateType) => {
  const {
    fetchedImages,
    images,
    description,
    price,
    discount,
    reference,
    colors,
    sizes,
    uid,
    fantasy,
    productId,
  } = state
  try {
    let _images
    if (images) {
      validateImages(images)
      _images = await Promise.all(
        images.map(async (image: File) => {
          try {
            const imageRef = storage.child(`${fantasy}/${fantasy}-${Date.now()}-${image.name}`)
            const uploadTask = await imageRef.put(image)
            const url = await uploadTask.ref.getDownloadURL()
            return url
          } catch (error) {
            throw new Error("Não foi possível enviar as imagens do produto")
          }
        }),
      )
    }
    const now = fs.FieldValue.serverTimestamp()
    await db
      .collection("suppliers")
      .doc(uid)
      .collection("products")
      .doc(productId)
      .update({
        dateUpdated: now,
        information: {
          description,
          discount,
          images: images ? _images : fetchedImages,
          price,
          reference,
        },
        variations: {
          colors,
          sizes,
        },
      })
    /** update suppliers collection with the timestamp of the updated gallery */
    await db.collection("suppliers").doc(uid).update({
      lastGalleryUpdate: now,
    })
  } catch (error) {
    if (error.response) console.log(error.response)
    console.log(error)
    throw error
  }
}

export default onSubmit
