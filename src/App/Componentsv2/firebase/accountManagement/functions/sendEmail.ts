import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { SendEmail } from "../types"

export async function sendEmail(data: SendEmail) {
  const config: AxiosRequestConfig = {
    url: "https://email.ziro.app/.netlify/functions/send-email",
    method: "POST",
    headers: {
      Authorization: process.env.EMAIL_TOKEN,
    },
  }
  await customAxios.request({ ...config, data })
  return { ok: true, msg: "Email enviado com sucesso!" }
}
