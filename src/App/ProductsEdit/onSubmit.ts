import { fs, db, storage } from "../../Firebase/index"
import clearForm from "./clearForm"
import validateImages from "./validateImages"
import { stateType, setStateType } from "./types"

const onSubmit = async (state: stateType, setState: setStateType) => {
  const { setIsSubmitting } = setState
  const { images, description, price, discount, reference, colors, sizes, uid, fantasy } = state
  try {
    validateImages(images)
    setIsSubmitting(true)
    const now = fs.FieldValue.serverTimestamp()
    const imagesUrls = await Promise.all(
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
    console.log(imagesUrls)
    const docRef = await db
      .collection("suppliers")
      .doc(uid)
      .collection("products")
      .add({
        dateCreated: now,
        dateUpdated: now,
        information: {
          description,
          discount,
          images: imagesUrls,
          price,
          reference,
        },
        variations: {
          colors,
          sizes,
        },
      })
    console.log(docRef)
    clearForm(setState)
  } catch (error) {
    if (error.response) console.log(error.response)
    console.log(error)
    throw error
  } finally {
    setIsSubmitting(false)
  }
}

export default onSubmit
