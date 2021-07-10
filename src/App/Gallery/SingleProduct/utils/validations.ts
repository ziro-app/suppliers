type validationParams = {
  images: string | number | FileList | boolean
  colors: string | number | FileList | boolean
  sizes: string | number | FileList | boolean
}

const validations = ({ images, colors, sizes }: validationParams) => [
  {
    inputName: "images",
    validation: (value: string | number | FileList | boolean) => typeof value === "object" && value && value.length > 0,
    value: images,
    message: "Escolha imagens para o produto",
  },
  {
    inputName: "colors",
    validation: (value: string | number | FileList | boolean) =>
      (value === "" && sizes === "") || (value !== "" && sizes === "") || (value !== "" && sizes !== ""),
    value: colors,
    message: "Preencha esse campo",
  },
  {
    inputName: "sizes",
    validation: (value: string | number | FileList | boolean) =>
      (value === "" && colors === "") || (value !== "" && colors === "") || (value !== "" && colors !== ""),
    value: sizes,
    message: "Preencha esse campo",
  },
]

export default validations
