import axios, { post } from "axios"
import { auth, db } from "../../Firebase/index"

const { formatDateUTC3 } = require("@ziro/format-date-utc3")

const sendToBackend = state => () => {
  const { fname, lname, email, pass, docId, supplierId, role } = state
  const nomeCompleto = fname && lname ? `${fname.trim()} ${lname.trim()}` : ""
  const today = new Date()
  const url = process.env.SHEET_URL
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: process.env.SHEET_TOKEN,
    },
  }
  const body = {
    apiResource: "values",
    apiMethod: "append",
    spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
    range: "Colaboradores!A1",
    resource: {
      values: [[formatDateUTC3(today), nomeCompleto, email, supplierId, "Aprovado", role]],
    },
    valueInputOption: "user_entered",
  }

  return new Promise(async (resolve, reject) => {
    try {
      try {
        const doc = await db.collection("collaborators").doc(docId).get()
        if (doc.exists) {
          const { status } = doc.data()
          if (status !== "Pendente") throw { msg: "Link inválido, solicite um novo", customError: true }

          // Cadastrando usuário na planilha
          await post(url, body, config)
          try {
            const config = {
              method: "POST",
              url: `${process.env.FIREBASE_AUTH_URL}createVerifiedUser`,
              data: { email, pass },
              headers: {
                "Content-Type": "application/json",
                Authorization: process.env.FIREBASE_AUTH_TOKEN,
              },
            }
            // Cadastrando no Firebase Auth
            await axios(config)
            // Login
            const { user } = await auth.signInWithEmailAndPassword(email, pass)

            // Atualizando o registro na collection
            await db.collection("collaborators").doc(docId).update({
              cadastro: today,
              uid: user.uid,
              status: "Aprovado",
            })

            try {
              await db.collection("users").add({ email, app: "suppliers" })
            } catch (error) {
              if (error.customError) throw error
              if (error.response) console.log(error.response)
              throw "Erro ao enviar email de verificação"
            }
          } catch (error) {
            console.log(error)
            if (error.customError) throw error
            if (error.code) {
              switch (error.code) {
                case "auth/network-request-failed":
                  throw { msg: "Sem conexão com a rede", customError: true }
                case "auth/invalid-email":
                  throw { msg: "Email inválido", customError: true }
                case "auth/email-already-in-use":
                  throw { msg: "Email já cadastrado", customError: true }
                case "auth/operation-not-allowed":
                  throw { msg: "Operação não permitida", customError: true }
                case "auth/weak-password":
                  throw { msg: "Senha fraca. Mínimo 6 caracteres", customError: true }
              }
            }
            if (error.response && error.response.data && error.response.data.erro) {
              const { erro, message } = error.response.data
              console.log(message)
              throw { msg: erro, customError: true }
            }
            throw "Erro ao criar usuário"
          }
        } else throw { msg: "Link inválido, solicite um novo", customError: true }
      } catch (error) {
        if (error.customError) throw error
        throw { msg: "Erro ao salvar usuário. Tente novamente.", customError: true }
      }
      window.location.replace("/")
    } catch (error) {
      if (error.customError) reject(error)
      else {
        console.log(error)
        if (error.response) console.log(error.response)
        reject(error)
      }
    }
  })
}

export default sendToBackend
