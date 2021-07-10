import { auth, fauth } from "@bit/ziro.firebase.init"
import { ReauthenticateData } from "../types"

export async function reauthenticate(data: ReauthenticateData) {
  try {
    if (!auth.currentUser) throw new Error("Usuário deve estar logado para reautenticar")
    const { email, password } = data
    /** reauthenticate user */
    const credential = fauth.EmailAuthProvider.credential(email, password)
    await auth.currentUser.reauthenticateWithCredential(credential)
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
      throw new Error(msg)
    } else {
      throw new Error(error.message)
    }
  }
}
