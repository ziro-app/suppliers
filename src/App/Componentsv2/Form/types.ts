type V = {
  inputName: string
  validation: (value: any) => boolean
  value: any
  message: string
}

export type validations = Array<V>

export type errorMessages = {
  [field: string]: string
}
