import { setStateType } from "./types"

const clearForm = (setState: setStateType) => {
  const { setImages, setDescription, setPrice, setDiscount, setReference, setColors, setSizes } = setState
  setImages(undefined)
  setDescription("")
  setPrice("")
  setDiscount("")
  setReference("")
  setColors("")
  setSizes("")
}

export default clearForm
