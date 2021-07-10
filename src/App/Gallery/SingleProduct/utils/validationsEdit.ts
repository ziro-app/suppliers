type validationParams = {
  colors: string | number | FileList | boolean
  sizes: string | number | FileList | boolean
}

const validations = ({ colors, sizes }: validationParams) => [
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
