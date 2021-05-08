import { Dispatch, SetStateAction } from "react"

export type stateType = {
  fetchedImages: string[]
  images: File[]
  description: string
  price: string
  discount: string
  reference: string
  colors: string
  sizes: string
  uid: string
  fantasy: string
  productId: string
}

export type setStateType = {
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setFetchedImages: Dispatch<SetStateAction<string[]>>
  setImages: Dispatch<SetStateAction<File[]>>
  setDescription: Dispatch<SetStateAction<string>>
  setPrice: Dispatch<SetStateAction<string>>
  setDiscount: Dispatch<SetStateAction<string>>
  setReference: Dispatch<SetStateAction<string>>
  setColors: Dispatch<SetStateAction<string>>
  setSizes: Dispatch<SetStateAction<string>>
}
