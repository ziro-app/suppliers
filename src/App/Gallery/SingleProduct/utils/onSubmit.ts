/* eslint-disable no-console */
import { fs, db, storage } from "@bit/ziro.firebase.init"
import { readAndCompressImage } from "browser-image-resizer"
import clearForm from "./clearForm"
import formatDataToSubmit from "./formatDataToSubmit"
import validateImages from "./validateImages"
import { stateType, setStateType } from "../types"

const onSubmit = async (state: stateType, setState: setStateType) => {
  const { title, description, price, discount, reference, colors, sizes } = formatDataToSubmit(state)
  const { fetchedImages, images, supplierUid, fantasia, productId } = state
  const imagesArray = Array.from(images)
  const hasImages = imagesArray.length > 0
  const now = fs.FieldValue.serverTimestamp()
  /** if user is editing a product, productId exists */
  if (productId !== "empty") {
    try {
      let _images
      if (hasImages) {
        validateImages(imagesArray)
        _images = await Promise.all(
          imagesArray.map(async (image: File) => {
            try {
              const compressed = await readAndCompressImage(image, { quality: 0.65 })
              const imageRef = storage.child(`${fantasia}/${fantasia}-${Date.now()}-${image.name}`)
              const uploadTask = await imageRef.put(compressed)
              const url: string = await uploadTask.ref.getDownloadURL()
              return url
            } catch (error) {
              throw new Error("Não foi possível enviar as imagens do produto")
            }
          }),
        )
      }
      await db
        .collection("suppliers")
        .doc(supplierUid)
        .collection("products")
        .doc(productId)
        .update({
          dateUpdated: now,
          information: {
            description,
            discount,
            images: hasImages ? _images : fetchedImages,
            price,
            reference,
            title,
          },
          variations: {
            colors,
            sizes,
          },
        })
      /** update suppliers collection with the timestamp of the updated gallery */
      await db.collection("suppliers").doc(supplierUid).update({
        lastGalleryUpdate: now,
      })
      /** fetch new data so user can see it on the page */
      const { setShouldFetch } = setState
      setShouldFetch(true)
    } catch (error) {
      if (error.response) console.log(error.response)
      console.log(error)
      throw error
    }
  } else {
    try {
      validateImages(imagesArray)
      const imagesUrls = await Promise.all(
        imagesArray.map(async (image: File) => {
          try {
            const compressed = await readAndCompressImage(image, { quality: 0.65 })
            const imageRef = storage.child(`${fantasia}/${fantasia}-${Date.now()}-${image.name}`)
            const uploadTask = await imageRef.put(compressed)
            const url: string = await uploadTask.ref.getDownloadURL()
            return url
          } catch (error) {
            throw new Error("Não foi possível enviar as imagens do produto")
          }
        }),
      )
      await db
        .collection("suppliers")
        .doc(supplierUid)
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
            title,
          },
          variations: {
            colors,
            sizes,
          },
        })
      /** update suppliers collection with the timestamp of the updated gallery */
      await db.collection("suppliers").doc(supplierUid).update({
        lastGalleryUpdate: now,
      })
      clearForm(setState)
    } catch (error) {
      if (error.response) console.log(error.response)
      console.log(error)
      throw error
    }
  }
}

export default onSubmit
