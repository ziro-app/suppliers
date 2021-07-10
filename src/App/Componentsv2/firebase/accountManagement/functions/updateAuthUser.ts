import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { UpdateUser, Default } from "../types"

export async function updateAuthUser(data: UpdateUser) {
  const config: AxiosRequestConfig = {
    url: "https://us-east1-ziro-app-data.cloudfunctions.net/updateUserInfo",
    method: "POST",
    headers: {
      Authorization: process.env.FIREBASE_AUTH_TOKEN,
    },
  }
  const {
    data: { ok },
  } = await customAxios.request<Default>({ ...config, data })
  return { ok, msg: "Usuário atualizado com sucesso!" }
}
