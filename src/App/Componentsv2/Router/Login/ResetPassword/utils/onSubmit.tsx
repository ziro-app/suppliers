/* eslint no-console: "off" */
import { emailExistence, resetPassword } from "@bit/ziro.firebase.account-management"

const onSubmit = async (email: string) => {
  try {
    if (!email) throw new Error("onSubmit: Email deve ser fornecido")
    /** check for email existance in auth */
    await emailExistence(email)
    await resetPassword({ email })
  } catch (error) {
    if (error.response) {
      console.log(error.response)
      throw new Error(error.response.data.erro)
    } else {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

export default onSubmit
