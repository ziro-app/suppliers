import { SetStateType } from "@bit/ziro.utils.types"

export type stateType = {
  fetchedImages: string[]
  images: FileList
  title: string
  description: string
  price: string
  discount: string
  reference: string
  colors: string
  sizes: string
  supplierUid: string
  fantasia: string
  productId: string
}

export type setStateType = {
  setShouldFetch: SetStateType<boolean>
  setIsLoading: SetStateType<boolean>
  setFetchedImages: SetStateType<string[]>
  setImages: SetStateType<FileList>
  setTitle: SetStateType<string>
  setDescription: SetStateType<string>
  setPrice: SetStateType<string>
  setDiscount: SetStateType<string>
  setReference: SetStateType<string>
  setColors: SetStateType<string>
  setSizes: SetStateType<string>
}
