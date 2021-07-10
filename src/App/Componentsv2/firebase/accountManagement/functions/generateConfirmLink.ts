import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { ConfirmLinkReq, ConfirmLinkResp } from "../types"

export async function generateConfirmLink(data: ConfirmLinkReq) {
  const config: AxiosRequestConfig = {
    url: "https://us-east1-ziro-app-data.cloudfunctions.net/resendConfirmEmail",
    method: "POST",
    headers: {
      Authorization: process.env.FIREBASE_AUTH_TOKEN,
    },
  }
  const { data: responseData } = await customAxios.request<ConfirmLinkResp>({
    ...config,
    data,
  })
  return responseData
}
