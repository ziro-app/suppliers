/* eslint-disable no-console */
import axios from "axios"
import { RequestInterceptor, ResponseInterceptor } from "./types"

export const request: RequestInterceptor = {
  onFulfilled: config => config,
  onRejected: error => {
    console.log(error)
    return Promise.reject(error)
  },
}

export const response: ResponseInterceptor = {
  onFulfilled: ({ data }) => data,
  onRejected: error => {
    if (axios.isCancel(error)) console.log("Requisição cancelada!")
    if (error.code === "ECONNABORTED") {
      const { code, message } = error
      console.log("Timeout: ", code, message)
    }
    return Promise.reject(error)
  },
}
