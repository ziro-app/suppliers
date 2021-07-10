/* eslint-disable no-console */
import { db, auth } from "@bit/ziro.firebase.init"
import { emailVerified } from "@bit/ziro.firebase.account-management"

const onSubmit = async (email: string, password: string, userApp: string) => {
  try {
    if (!email) throw new Error("onSubmit: Email deve ser fornecido")
    if (!password) throw new Error("onSubmit: Senha deve ser fornecida")
    if (!userApp) throw new Error("onSubmit: App deve ser fornecido")
    const userQuerySnapshot = await db.collection("users").where("email", "==", email).get()
    const [userDoc] = userQuerySnapshot.docs
    if (userDoc && userDoc.data().app === userApp) {
      const ok = await emailVerified(email)
      if (!ok) throw new Error("Acesse o email de confirmação")
      await auth.signInWithEmailAndPassword(email.toLowerCase(), password)
    } else throw new Error("Não cadastrado no app (collection)")
  } catch (error) {
    let msg = ""
    if (error.code) {
      switch (error.code) {
        case "auth/network-request-failed":
          msg = "Sem conexão com a rede. Tente novamente mais tarde"
          break
        case "auth/invalid-email":
          msg = "Email inválido"
          break
        case "auth/user-disabled":
          msg = "Usuário bloqueado"
          break
        case "auth/user-not-found":
          msg = "Usuário não cadastrado (auth)"
          break
        case "auth/wrong-password":
          msg = "Senha incorreta"
          break
        case "auth/too-many-requests":
          msg = "Muitas tentativas. Tente novamente mais tarde"
          break
        default:
          msg = "Erro de autorização. Contate suporte"
          break
      }
      console.log("msg", msg)
      throw new Error(msg)
    } else if (error.response) {
      console.log("error.response", error.response)
      throw new Error(error.response.data.erro)
    } else {
      console.log(error)
      throw new Error(error.message)
    }
  }
}

export default onSubmit
