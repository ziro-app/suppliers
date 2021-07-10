import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { Default } from "../types"

export async function deleteAuthUser(uid: string) {
  const config: AxiosRequestConfig = {
    url: "https://us-east1-ziro-app-data.cloudfunctions.net/deleteAuthUser",
    method: "POST",
    headers: {
      Authorization: process.env.FIREBASE_AUTH_TOKEN,
    },
  }
  const {
    data: { ok },
  } = await customAxios.request<Default>({ ...config, data: { uid } })
  return { ok, msg: "Usuário atualizado com sucesso!" }
}
