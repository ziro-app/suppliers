/* eslint no-console: "off" */
/* eslint consistent-return: "off" */
import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { RequestZoop } from "../types"

export async function requestZoop(reqData: RequestZoop, maxRequests: number, iteration = 1) {
  try {
    if (iteration > maxRequests) return
    const { url, data, id } = reqData
    let finalUrl = url
    let config: AxiosRequestConfig = { headers: { Authorization: process.env.PAY_TOKEN } }
    // If id comes, it's a delete request
    if (id) finalUrl = `${url}${id}`
    else config = { ...config, data }
    const result = await customAxios.post(finalUrl, {}, config)
    return result
  } catch (error) {
    console.log(`Erro na requisição nº ${iteration}`, error)
    if (iteration + 1 <= maxRequests) setTimeout(() => requestZoop(reqData, maxRequests, iteration + 1), 2000)
    else throw error
  }
}
