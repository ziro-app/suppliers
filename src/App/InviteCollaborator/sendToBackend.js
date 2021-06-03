/* eslint no-throw-literal: "off" */
/* eslint no-async-promise-executor: "off" */
/* eslint prefer-promise-reject-errors: "off" */
import { post } from "axios"
import { db } from "../../Firebase/index"

const mountLink = uid => {
  if (uid) return `https://fabricantes.ziro.app/cadastrar-colaborador?dc=${btoa(uid)}`
  return ""
}

const checkEmail = async email => {
  const url = `${process.env.FIREBASE_AUTH_URL}checkEmailExistence`
  const body = { email }
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.FIREBASE_AUTH_TOKEN,
    },
  }
  return post(url, body, config)
}

const sendToBackend = state => () => {
  const {
    uid,
    supplier,
    fname,
    lname,
    email,
    role,
    submitCount,
    brand,
    setFName,
    setLName,
    setEmail,
    setRole,
    setSubmitCount,
    setBrand,
  } = state
  const nome = fname && lname ? `${fname.trim()} ${lname.trim()}` : ""
  const url = process.env.API_EMAIL
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: process.env.EMAIL_TOKEN,
    },
  }
  return new Promise(async (resolve, reject) => {
    let exists = true
    try {
      if (uid && email) {
        try {
          const {
            data: { ok },
          } = await checkEmail(email)
          exists = ok
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.erro &&
            error.response.data.erro === "Usuário não encontrado"
          )
            exists = false
          else throw error
        }
        if (!exists) {
          const userDb = await db.collection("collaborators").add({
            fname: fname ? fname.trim() : "",
            lname: lname ? lname.trim() : "",
            email,
            status: "Pendente",
            ownerId: uid,
            role,
            brand: brand || supplier,
          })
          const link = mountLink(userDb.id)
          const body = {
            to: email,
            customEmail: false,
            inviteColaborator: {
              name: nome,
              supplier,
              link,
            },
          }
          await post(url, body, config)
          setFName("")
          setLName("")
          setEmail("")
          setRole("")
          setBrand("")
          setSubmitCount(submitCount + 1)
          resolve("Email enviado com sucesso")
        } else throw { msg: "Email utilizado em outra conta", customError: true }
      } else throw { msg: "Erro nas informações. Recarregue a página e tente novamente.", customError: true }
    } catch (error) {
      console.log(error)
      if (error.customError) reject(error)
      else if (error.response) {
        console.log(error.response)
        const errorMsg = (error.response.data && error.response.data.erro) || ""
        reject({ msg: errorMsg || "Ocorreu um erro, contate o suporte.", customError: true })
      } else reject(error)
    }
  })
}

export default sendToBackend
