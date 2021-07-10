import { AxiosRequestConfig } from "axios"
import { customAxios } from "@bit/ziro.utils.use-http"
import { SheetData } from "../types"

export async function requestSheet(data: SheetData): Promise<void> {
  const config: AxiosRequestConfig = {
    url: "https://ziro-sheets.netlify.app/.netlify/functions/api",
    method: "POST",
    headers: {
      Authorization: process.env.SHEET_TOKEN,
    },
  }
  await customAxios.request({ ...config, data })
}
