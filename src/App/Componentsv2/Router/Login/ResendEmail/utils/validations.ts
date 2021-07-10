import { FormValueType } from "@bit/ziro.views.form"

const validations = (email: FormValueType) => [
  {
    inputName: "email",
    validation: (value: FormValueType) => typeof value === "string" && /^\S+@\S+\.\S+$/g.test(value),
    value: email,
    message: "Email inválido",
  },
]

export default validations
