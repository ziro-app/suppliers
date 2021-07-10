/* eslint no-console: "off" */
import { config } from "config"
import { emailVerified, resendConfirmEmail } from "@bit/ziro.firebase.account-management"

const { authContinueUrl } = config

const onSubmit = async (email: string) => {
  try {
    if (!email) throw new Error("onSubmit: Email deve ser fornecido")
    const ok = await emailVerified(email)
    if (ok) throw new Error("Email já validado. Faça o login")
    await resendConfirmEmail({
      type: "Email",
      email,
      continueUrl: authContinueUrl,
    })
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
