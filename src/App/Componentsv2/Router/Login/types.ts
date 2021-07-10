export type Validations = {
  inputName: string
  validation: (value: string) => boolean
  value: string
  message: string
}[]

export type ErrorMessages = {
  [field: string]: string
}
