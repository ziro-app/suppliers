import { setStateType } from "../types"

const clearForm = (setState: setStateType) => {
  const { setImages, setTitle, setDescription, setPrice, setDiscount, setReference, setColors, setSizes } = setState
  /* @ts-ignore */
  setImages({ item: () => null, length: 0 })
  setTitle("")
  setDescription("")
  setPrice("")
  setDiscount("")
  setReference("")
  setColors("")
  setSizes("")
}

export default clearForm
