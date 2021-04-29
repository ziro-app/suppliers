type validationParams = {
  images: File[]
}

const validations = ({ images }: validationParams) => [
  {
    inputName: "images",
    validation: (value: File[]) => value && value.length > 0,
    value: images,
    message: "Escolha imagens para o produto",
  },
]

export default validations
