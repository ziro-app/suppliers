type params = string | number

type validationParams = {
  description: params
}

const validations = ({ description }: validationParams) => [
  {
    inputName: "description",
    validation: (value: params) => typeof value === "string" && value.length > 0,
    value: description,
    message: "Descrição não pode ser vazia",
  },
]

export default validations
